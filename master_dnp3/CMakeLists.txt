cmake_minimum_required(VERSION 3.11)

project(master VERSION 1)

add_subdirectory(./opendnp3)

include_directories(
    ./opendnp3/cpp/lib/include
    ./opendnp3/cpp/lib/src
    ./src
)

link_directories(./opendnp3/cpp/src)

add_executable(
    master
    ./src/fileLogger.cpp
    ./src/fileSOEHandler.cpp
    ./src/fileCommandResultCallback.cpp
    ./src/main.cpp
)

target_link_libraries(master PRIVATE opendnp3)

install(TARGETS master RUNTIME DESTINATION bin)

