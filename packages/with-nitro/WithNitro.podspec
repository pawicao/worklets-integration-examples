require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))
has_worklets = system(
  'node', '--eval', "require.resolve('react-native-worklets/package.json')",
  chdir: __dir__, out: File::NULL, err: File::NULL
)

Pod::Spec.new do |s|
  s.name = 'WithNitro'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = package['homepage']
  s.author = 'Worklets integration examples'
  s.platforms = { :ios => min_ios_version_supported }
  s.source = { :path => '.' }
  s.source_files = 'cpp/**/*.{hpp,cpp}'

  load 'nitrogen/generated/ios/WithNitro+autolinking.rb'
  add_nitrogen_files(s)

  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'
  s.dependency 'RNWorklets' if has_worklets
  install_modules_dependencies(s)
end
