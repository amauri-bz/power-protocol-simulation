cmake_minimum_required(VERSION 3.11)

project(outstation VERSION 1)

add_subdirectory(./opendnp3)

include_directories(
    ./opendnp3/cpp/lib/include
    ./opendnp3/cpp/lib/src
    ./src
)

link_directories(./opendnp3/cpp/src)

add_executable(
    outstation
    ./src/fileLogger.cpp
    ./src/commandHandler.cpp
    ./src/main.cpp
)

target_link_libraries(outstation PRIVATE opendnp3)

install(TARGETS outstation RUNTIME DESTINATION bin)

