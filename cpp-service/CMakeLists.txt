cmake_minimum_required(VERSION 3.10)
project(cpp_service)

set(CMAKE_CXX_STANDARD 17)

find_package(OpenCV REQUIRED)

include_directories(
    include
    ${OpenCV_INCLUDE_DIRS}
)

add_executable(cpp_service
    src/main.cpp
)

target_link_libraries(cpp_service ${OpenCV_LIBS})
