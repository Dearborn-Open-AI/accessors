ROOT = ../../..

# The location of the duktape sources
DUKTAPE = ../duktape2

DUKTAPE_SOURCES = $(DUKTAPE)/src/duktape.c

DUKTAPE_SOURCES += $(DUKTAPE)/extras/module-duktape/duk_module_duktape.c
DUKTAPE_SOURCES += $(DUKTAPE)/extras/print-alert/duk_print_alert.c


C_FILES = \
	c_eventloop.c \
	duk_stack.c \
	eduk2.c \
	modSearch.c \
	nofileio.c \
	$(DUKTAPE_SOURCES) $(DUKTAPE_CMDLINE_SOURCES)


# .h files that contain the contents of .js files
JS_H_FILES = \
	AccessorStatus.h \
	RampJSDisplay.h \
	RampJSInspect.h \
	RampJSTest.h \
	RampJSTextDisplay.h \
	Stop.h \
	TestAdder.h \
	TestComposite.h \
	TextDisplay.h \
	TestGain.h \
	TestSpontaneous.h \
	TrainableTest.h \
	autoAccessorStatusTest.h \
	autoTestComposite.h \
	autoTestStop.h \
	c_eventloop.h \
	commonHost.h \
	deterministicTemporalSemantics.h \
	duktapeHost.h \
	ecma_eventloop.h \
	events.h \
	modulesUtil.h \
	testCommon.h \
	text-display.h \
	util.h

H_FILES = \
	$(DUKTAPE)/src/duk_config.h \
	$(DUKTAPE)/src/duktape.h \
	$(JS_H_FILES)

CC	= gcc

CCOPTS	= -Os -pedantic -std=c99 -Wall -fstrict-aliasing -fomit-frame-pointer

# Accessors: Include duktapeHost.h in ..
CCOPTS += -I. -I$(DUKTAPE)/src   # duktape.h and duk_config.h must be in include path

# Enable print() and alert() for command line using an optional extra module.
CCOPTS += -DDUK_CMDLINE_PRINTALERT_SUPPORT -I$(DUKTAPE)/extras/print-alert

# Enable Duktape 1.x module loading for command line.
CCOPTS += -DDUK_CMDLINE_MODULE_SUPPORT -I$(DUKTAPE)/extras/module-duktape

CCLIBS	= -lm

# Uncomment the next line to compile with debugging
#CCOPTS	= -ggdb -pedantic -std=c99 -Wall

EDUK_DEFINES = -DEDUK_FULL -DEDUK_RAMPJSDISPLAY
EDUK_MIN_DEFINES = -DEDUK_MIN -DHAIL_PRINT
# EDUK_DEFINES = $(EDUK_MIN_DEFINES)
eduk2: $(C_FILES) $(H_FILES) 
	$(CC) -o $@ $(DEFINES) $(EDUK_DEFINES) $(SWARMLET) $(CCOPTS) $(C_FILES) $(CCLIBS)


# Version of eduk that does not load up the accessors.
eduk2.min: $(C_FILES) $(H_FILES) 
	$(CC) -o $@ $(DEFINES) $(EDUK_MIN_DEFINES) $(SWARMLET) $(CCOPTS) $(C_FILES) $(CCLIBS)

# Convert from C to Rust, see https://github.com/jameysharp/corrode
eduk2.rs:
	corrode -o $@ $(DEFINES) $(CCOPTS) $(C_FILES) $(CCLIBS)

TCMALLOC_FLAGS = -fno-builtin-malloc -fno-builtin-calloc -fno-builtin-realloc -fno-builtin-free
eduk2.tcmalloc: $(C_FILES) $(H_FILES)
	$(CC) -o $@ $(DEFINES) $(TCMALLOC_FLAGS) $(CCOPTS) $(C_FILES) $(CCLIBS) -ltcmalloc

# Options for a smaller eduk
# See https://www.icyphy.org/accessors/wiki/Main/DuktapeForSmallProcessors#CompilerOptionsforDuktape
TINY_EDUK_FLAGS = -DDUK_OPT_NO_FILE_IO -DDUK_OPT_LIGHTFUNC_BUILTINS -DDUK_OPT_BUFLEN16 -DDUK_OPT_OBJSIZES16 -DDUK_OPT_REFCOUNT16 -DDUK_OPT_STRHASH16 -DDUK_OPT_STRLEN16 -DDUK_OPT_SELF_TESTS
eduk2.tiny: $(C_FILES) $(H_FILES)
	$(CC) -o $@ $(DEFINES) $(TINY_EDUK_FLAGS) $(CCOPTS) $(C_FILES) $(CCLIBS)

eduk2.tiny.tcmalloc: $(C_FILES) $(H_FILES)
	$(CC) -o $@ $(DEFINES) $(TINY_EDUK_FLAGS) $(TCMALLOC_FLAGS) $(CCOPTS) $(C_FILES) $(CCLIBS) -ltcmalloc

# .h files that contain the .js files.  
# c_eventloop.h and duktapeHost.h are core files that are read in by
# the eduk2 executable during start up.
c_eventloop.h: c_eventloop.js  makefile
	./js2h $< $@

duktapeHost.h: ../duktapeHost.js  makefile
	./js2h $< $@

# The .h files below here are read in by the nofileio_readfile()
# function in nofileio.c, which is called by Duktape.modSearch() in
# ../duktapeHost.js, which is converted to duktapeHost.h

# Common Host.  All duktape2 and eduk2 accessor hosts will need these files.
commonHost.h: ../../common/commonHost.js makefile
	./js2h $< $@

events.h: ../../common/modules/events.js makefile
	./js2h $< $@

util.h: ../../common/modules/util.js makefile
	./js2h $< $@

text-display.h: ../../common/modules/text-display.js makefile
	./js2h $< $@

# ecma_eventloop.h is used in hosts/duktape/duktape2 and not hosts/duketape/eduk2/eduk2
ecma_eventloop.h: ../duktape2/examples/eventloop/ecma_eventloop.js makefile
	./js2h $< $@


# Composite Accessors used for testing.  Production duktape accessor
# hosts will not include these files.
RampJSDisplay.h: $(ROOT)/test/auto/RampJSDisplay.js makefile
	./js2h $< $@
RampJSInspect.h: $(ROOT)/test/auto/RampJSInspect.js makefile
	./js2h $< $@
RampJSTest.h: $(ROOT)/test/auto/RampJSTest.js makefile
	./js2h $< $@
RampJSTextDisplay.h: $(ROOT)/test/auto/RampJSTextDisplay.js makefile
	./js2h $< $@

Stop.h: $(ROOT)/utilities/Stop.js makefile
	./js2h $< $@

autoAccessorStatusTest.h: $(ROOT)/test/auto/AccessorStatusTest.js makefile
	./js2h $< $@

autoTestComposite.h: $(ROOT)/test/auto/TestComposite.js makefile
	./js2h $< $@

autoTestStop.h: $(ROOT)/test/auto/Stop.js makefile
	./js2h $< $@

deterministicTemporalSemantics.h: ../../common/modules/deterministicTemporalSemantics.js makefile
	./js2h $< $@

modulesUtil.h: ../modules/util.js makefile
	./js2h $< $@

# Used by ../duktape/duktape2 tests
testCommon.h: ../../common/test/testCommon.js makefile
	./js2h $< $@
# Accessors
AccessorStatus.h: $(ROOT)/trusted/AccessorStatus.js makefile
	./js2h $< $@
TestAdder.h: $(ROOT)/test/TestAdder.js makefile
	./js2h $< $@
TestComposite.h: $(ROOT)/test/TestComposite.js makefile
	./js2h $< $@
TextDisplay.h: $(ROOT)/utilities/TextDisplay.js makefile
	./js2h $< $@
TestGain.h: $(ROOT)/test/TestGain.js makefile
	./js2h $< $@
TestSpontaneous.h: $(ROOT)/test/TestSpontaneous.js makefile
	./js2h $< $@
TrainableTest.h: $(ROOT)/test/TrainableTest.js makefile
	./js2h $< $@

clean:
	rm -f eduk2 $(JS_H_FILES)
