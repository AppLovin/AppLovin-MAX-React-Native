# AppLovin MAX React Native Module

AppLovin MAX React Native Module for Android and iOS.

## Documentation
Check out our integration docs [here](https://support.axon.ai/en/max/react-native/overview/integration).

## Demo Apps
The `/example` directory contains the demo app. Gradle and CocoaPods automatically pull in the React Native module for easier debugging, and Swift Package Manager pulls in the AppLovin SDK on iOS.

## iOS Setup
The module gets the AppLovin SDK through Swift Package Manager; new iOS SDK versions are no longer published to CocoaPods. It requires React Native 0.75 or later.

1. In Xcode, open your app's `ios/<App>.xcworkspace` and select **File > Add Package Dependencies…**.
2. Add `https://github.com/AppLovin/AppLovin-MAX-Swift-Package` with the rule **Up to Next Major Version** from 13.0.0, and add its `AppLovinSDK` product to your app target. The module pins the exact SDK version it's certified with; without the package on your app target, the build fails with undefined `AL…` symbols.
3. Add the Swift package of each mediated network you're integrating (`https://github.com/AppLovin/AppLovin-MAX-Swift-Package-<Network>`) to your app target, instead of adapter pods in your `Podfile`.
4. Run `pod install` in your `ios` folder as usual for React Native.

<img src="https://github.com/AppLovin/AppLovin-MAX-React-Native/assets/100324169/b8214e97-582c-4855-82fe-430008bb3d8f" width="350" height="700" />

## License
MIT
