package com.applovin.reactnative;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * Created by Thomas So on July 11 2020
 */
public class AppLovinMAXPackage
    extends TurboReactPackage
{
    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext)
    {
        List<ViewManager> viewManagers = new ArrayList<>( 2 );
        viewManagers.add( new AppLovinMAXAdViewManager() );
        viewManagers.add( new AppLovinMAXNativeAdViewManager() );
        return viewManagers;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider()
    {
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
            moduleInfos.put(
                AppLovinMAXModuleImpl.NAME,
                new ReactModuleInfo(
                    AppLovinMAXModuleImpl.NAME,
                    AppLovinMAXModuleImpl.NAME,
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    true, // hasConstants
                    false, // isCxxModule
                    isTurboModule // isTurboModule
                ) );
            return moduleInfos;
        };
    }

    @Nullable
    @Override
    public NativeModule getModule(String name, @NonNull ReactApplicationContext reactContext)
    {
        if ( name.equals( AppLovinMAXModuleImpl.NAME ) )
        {
            return new AppLovinMAXModule( reactContext );
        }
        else
        {
            return null;
        }
    }
}
