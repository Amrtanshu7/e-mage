cmake_minimum_required(VERSION 3.10)
project(cpp_service)

set(CMAKE_CXX_STANDARD 17)

include_directories(include)

add_executable(cpp_service
    src/main.cpp
)
