all:
	yarn

build: all
	yarn build

dev: all
	yarn dev

test: all
	yarn test

clean:
	rm -rf build