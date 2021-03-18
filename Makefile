#############################################################################
-include Makefile.options
deploy_dir?=
#############################################################################
dist:
	mkdir -p $@

dist/bundle.js: app/audio.js app/audio-ffmpeg.js app/audio-mp3.js | dist
	browserify app/audio.js > $@_
	mv $@_ $@

dist/lame.min.js: node_modules/lamejs/lame.min.js | dist	
	cp $< $@

dist/ffmpeg.min.js: node_modules/@ffmpeg/ffmpeg/dist/ffmpeg.min.js | dist	
	cp $< $@

dist/ffmpeg.min.js.map: node_modules/@ffmpeg/ffmpeg/dist/ffmpeg.min.js.map | dist	
	cp $< $@	

.build.done: dist/bundle.js dist/lame.min.js dist/ffmpeg.min.js dist/ffmpeg.min.js.map
	touch $@
build: .build.done | dist
#############################################################################
serve:
	npm start

prepare:
	npm install
#############################################################################
$(deploy_dir)/dist:
	mkdir -p $@

copy_deploy: | $(deploy_dir)/dist
	cp index.html $(deploy_dir)/
	cp -r dist/* $(deploy_dir)/dist/
#############################################################################
clean: 
	rm -rf dist
	rm -rf node_modules
