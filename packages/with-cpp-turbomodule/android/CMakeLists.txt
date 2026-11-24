cmake_minimum_required(VERSION 3.13)

add_library(cppcounter STATIC ../cpp/CppCounter.cpp)
target_include_directories(cppcounter PUBLIC ../cpp)
target_compile_reactnative_options(cppcounter PRIVATE)
target_link_libraries(cppcounter fbjni jsi reactnative react_codegen_CppCounterSpec)

find_package(react-native-worklets CONFIG)
if(react-native-worklets_FOUND)
  target_link_libraries(cppcounter react-native-worklets::worklets)
endif()
