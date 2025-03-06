package com.applovin.reactnative;

import com.applovin.sdk.AppLovinSdkUtils;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;

import java.util.HashMap;
import java.util.Map;

import androidx.annotation.Nullable;

class AppLovinMAXUtils
{
    public static Map<String, Object> convertReadbleArrayToHashMap(@Nullable final ReadableArray readableArray)
    {
        if ( readableArray == null || readableArray.size() == 0 ) return null;

        Map<String, Object> hashMap = new HashMap<>();

        for ( int i = 0; i < readableArray.size(); i++ )
        {
            ReadableMap readableMap = readableArray.getMap( i );

            String key = readableMap.getString( "key" );

            if ( !AppLovinSdkUtils.isValidString( key ) ) continue;

            if ( readableMap.hasKey( "value" ) )
            {
                Dynamic value = readableMap.getDynamic( "value" );
                ReadableType type = readableMap.getType( "value" );

                if ( type == ReadableType.String )
                {
                    hashMap.put( key, value.asString() );
                }
                else if ( type == ReadableType.Number )
                {
                    hashMap.put( key, value.asDouble() );
                }
                else if ( type == ReadableType.Boolean )
                {
                    hashMap.put( key, value.asBoolean() );
                }
                else if ( type == ReadableType.Null )
                {
                    hashMap.put( key, null );
                }
            }
        }

        return hashMap;
    }
}
