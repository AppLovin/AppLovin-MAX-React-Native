require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-applovin-max"
  s.version      = package["version"]
  s.summary      = <<-DESC
    AppLovin MAX React Native Module for Android and iOS
   DESC
  s.description  = <<-DESC
                  react-native-applovin-max
                   DESC
  s.homepage     = "https://github.com/github_account/react-native-applovin-max"
  s.license      = "MIT"
  s.authors      = { "Thomas So" => "http://support-developer.applovin.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/github_account/react-native-applovin-max.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "AppLovinSDK"
end
