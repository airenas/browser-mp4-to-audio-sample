-include ../Makefile.options
#####################################################################################
dist_dir=$(CURDIR)/deploy
source_dir=../dist
service=browser-audio-extract
version=0.1
commit_count=$(shell git rev-list --count HEAD)
#####################################################################################
$(dist_dir):
	mkdir -p $@
$(dist_dir)/html/dist:
	mkdir -p $@

$(dist_dir)/.build: | $(dist_dir)/html/dist
	cp -r $(source_dir)/* $(dist_dir)/html/dist/
	cp ../index.html $(dist_dir)/html/
	cp ../favicon.ico $(dist_dir)/html/
	touch $(dist_dir)/.build

build: $(dist_dir)/.build
########### DOCKER ##################################################################
tag=$(USER)/$(service):$(version).$(commit_count)

dbuild: build
	docker build -t $(tag) ./

dpush: dbuild
	docker push $(tag)
	@echo -n "\n$(GREEN)CONTAINER:$(C_NC) $(tag)\n\n"
########### END #####################################################################
clean:
	rm -rf $(dist_dir)

.PHONY:
	clean dbuild dpush build 
