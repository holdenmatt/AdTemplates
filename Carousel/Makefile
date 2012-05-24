# Makefile to compress JS/CSS using YUI Compressor.

MAKE = make --always-make

SRC = ./src
BUILD = ./build
YUI_DIR = $(BUILD)/yui

OUTPUT = $(BUILD)/Carousel.js
MINIFIED = $(BUILD)/Carousel.min.js

YUI_FILE = yuicompressor-2.4.7
YUI_URL = http://yui.zenfs.com/releases/yuicompressor/$(YUI_FILE).zip
YUI_FLAGS = --line-break 1000
YUI = $(YUI_DIR)/$(YUI_FILE)/build/$(YUI_FILE).jar $(YUI_FLAGS)

STYLE_STRING = window.Carousel.styles = \'%s\';

all:
	$(MAKE) build

build:
	# Download YUICompressor on first build.
	test -d $(YUI_DIR) || $(MAKE) build-setup

	# Concat source.
	cat $(SRC)/iscroll.js \
	 	$(SRC)/Carousel.js \
	 	> $(BUILD)/Carousel.js

	# Inline compressed CSS.
	java -jar $(YUI) $(SRC)/Carousel.css | xargs -0 printf "$(STYLE_STRING)" >> $(OUTPUT)

	# Compress JS.
	java -jar $(YUI) $(OUTPUT) -o $(MINIFIED)

build-setup:
	$(MAKE) clean
	mkdir $(BUILD) $(YUI_DIR)
	cd $(YUI_DIR); curl -O $(YUI_URL); tar -xf $(YUI_FILE).zip; rm $(YUI_FILE).zip

clean:
	rm -rf $(BUILD)
