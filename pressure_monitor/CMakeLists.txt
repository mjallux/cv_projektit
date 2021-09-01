cmake_minimum_required(VERSION 3.16.0)
include($ENV{IDF_PATH}/tools/cmake/project.cmake)
project(saola_i2c)

set(CMAKE_CXX_FLAGS "${CMAGE_CXX_FLAGS} -std=c++17 -Og")