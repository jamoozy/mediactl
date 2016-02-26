.PHONY : all

sizes:=16 19 38 48 128

all : $(sizes:%=images/icon%.png)

images/icon%.png : images/icon.svg
	inkscape -w $* -D -e $@ $<
