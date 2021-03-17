dist:
	mkdir -p $@

dist/bundle.js: app/audio.js | dist
	npm run build

dist/lame.min.js: node_modules/lamejs/lame.min.js | dist	
	cp $< $@

build: dist/bundle.js dist/lame.min.js | dist

clean: 
	rm -r dist
