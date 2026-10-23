UNAME := $(shell uname)
CCFLAGS := -I./include -static-libgcc -static-libstdc++
PROGRAM_NAME := main
PROGRAM_EXEC := ./${PROGRAM_NAME}
ifeq ($(UNAME), Windows_NT)
	CCFLAGS += -lws2_32 -lwsock32
	PROGRAM_EXEC := ${PROGRAM_NAME}
endif

All build:
	@echo Compiling...
	g++ ${PROGRAM_NAME}.cpp -o ${PROGRAM_NAME} ${CCFLAGS}
	@echo Done!

run:
	@echo Compiling...
	g++ ${PROGRAM_NAME}.cpp -o ${PROGRAM_NAME} ${CCFLAGS}
	@echo Done!
	@${PROGRAM_EXEC}
