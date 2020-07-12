package com.applovin.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import androidx.annotation.NonNull;

/**
 * Created by Thomas So on July 11 2020
 */
public class AppLovinMAXModule
  extends ReactContextBaseJavaModule
{
  public AppLovinMAXModule(@NonNull final ReactApplicationContext reactContext)
  {
    super( reactContext );
  }

  @Override
  @NonNull public String getName()
  {
    return "AppLovinMAX";
  }

  //    // Example method
  //    // See https://facebook.github.io/react-native/docs/native-modules-android
  //    @ReactMethod
  //    fun multiply(a: Int, b: Int, promise: Promise) {
  //
  //      promise.resolve(a * b)
  //
  //    }
}
