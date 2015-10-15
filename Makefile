.PHONY: test

SRC = $(shell find src -name "*.js" -type f | sort)
LIB = $(patsubst src/%.js, lib/%.js, $(SRC))
NAME = $(shell node -e "console.log(require('./package.json').name)")
TAPE = ./node_modules/.bin/babel-tape-runner

.PHONY: test lint

BABEL = ./node_modules/.bin/babel
ESLINT = ./node_modules/.bin/eslint

default: all

lib:
	mkdir -p lib/

lib/%.js: src/%.js lib
	$(BABEL) "$<" > lib/$(notdir $<)

all: compile

compile: $(LIB) package.json

install: clean all
	npm install -g .

reinstall: clean
	$(MAKE) uninstall
	$(MAKE) install

uninstall:
	npm uninstall -g ${NAME}

dev-install: package.json
	npm install .

clean:
	rm -rf lib

publish: all test
	git push --tags origin HEAD:master
	npm publish

test:
	@$(TAPE) test/*

lint:
	@$(ESLINT) src/ test/
