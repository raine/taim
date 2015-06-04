require! <[ pretty-hrtime chalk ]>
require! ramda: {apply, map, for-each, init}: R

COLORS     = <[ green yellow blue magenta cyan white ]>
rotate     = (xs) -> i = 0; -> xs[i++ % xs.length]
next-color = rotate COLORS
println    = (+ '\n') >> process.stderr~write

get-args = (label, val) ->
    if typeof label is not \string
        val := label; label := null
    [val, label]

print-duration = (end, color, label) ->
    pre = if label then "#{chalk.bold label} took " else ''
    dur = pretty-hrtime end
    println color pre + dur

module.exports = taim = (label, val) ->
    color = chalk[next-color!]
    [val, label] = get-args label, val

    switch
    | (typeof val?.then) is \function
        start = process.hrtime!
        res <- val.then
        end = process.hrtime start
        print-duration end, color, label
        res
    | (typeof val) is \function
        (...args) ->
            start = process.hrtime!
            res = val.apply this, args
            if (typeof res?.then is \function)
                res.then ->
                    end = process.hrtime start
                    print-duration end, color, label
                    it
            else
                end = process.hrtime start
                print-duration end, color, label
            res

    | otherwise
        println 'taim error: input should be a function or thenable'
        val

module.exports.cb = (label, val) ->
    color = chalk[next-color!]
    [val, label] = get-args label, val

    if typeof val is \function
        (...args) ->
            cb = args[*-1]
            start = process.hrtime!
            val.apply this, (init args) ++ ->
                end = process.hrtime start
                print-duration end, color, label
                apply cb, arguments
    else
        println 'taim error: input should be a function'
        val

<[ compose pipe composeP pipeP ]> |> for-each ->
    module.exports[it] = (...args) ->
        apply R[it], map taim, args
