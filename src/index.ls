require! <[ pretty-hrtime chalk ]>
require! ramda: {apply, unapply, map, for-each}: R

COLORS     = <[ green yellow blue magenta cyan white ]>
rotate     = (xs) -> i = 0; -> xs[i++ % xs.length]
next-color = rotate COLORS
println    = (+ '\n') >> process.stderr~write

print-duration = (end, color, label) ->
    pre = if label then "#{chalk.bold label} took " else ''
    dur = pretty-hrtime end
    println color pre + dur

module.exports = taim = (label, val) ->
    color = chalk[next-color!]
    if typeof label is not \string
        val := label
        label := null

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

<[ compose pipe composeP pipeP ]> |> for-each ->
    module.exports[it] = (...args) ->
        apply R[it], map taim, args
