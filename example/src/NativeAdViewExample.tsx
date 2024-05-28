import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import {
    NativeAdView,
    TitleView,
    AdvertiserView,
    BodyView,
    CallToActionView,
    IconView,
    OptionsView,
    MediaView,
    StarRatingView,
} from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo, NativeAdViewHandler } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

type Props = {
    adUnitId: string;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeAdShowing: boolean;
    setIsNativeAdShowing: (showing: boolean) => void;
};

const NATIVE_AD_MEDIAVIEW_WIDTH = 340;
const NATIVE_AD_MEDIAVIEW_HEIGHT = 200;

export const NativeAdViewExample = ({
    adUnitId,
    isInitialized,
    log,
    isNativeAdShowing,
    setIsNativeAdShowing,
}: Props) => {
    const DEFAULT_ASPECT_RATIO = 16 / 9;
    const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO);
    const [mediaViewSize, setMediaViewSize] = useState({});
    const [isNativeAdLoading, setIsNativeAdLoading] = useState(false);

    // Ref for NativeAdView
    const nativeAdViewRef = useRef<NativeAdViewHandler>(null);

    // adjust the size of MediaView when `aspectRatio` changes
    useEffect(() => {
        if (aspectRatio * NATIVE_AD_MEDIAVIEW_HEIGHT > NATIVE_AD_MEDIAVIEW_WIDTH) {
            setMediaViewSize({ aspectRatio: aspectRatio, width: NATIVE_AD_MEDIAVIEW_WIDTH, height: undefined });
        } else {
            setMediaViewSize({ aspectRatio: aspectRatio, width: undefined, height: NATIVE_AD_MEDIAVIEW_HEIGHT });
        }
    }, [aspectRatio]);

    const NativeAdExample = useCallback(() => {
        return (
            <NativeAdView
                adUnitId={adUnitId}
                placement="myplacement"
                customData="mycustomdata"
                ref={nativeAdViewRef}
                style={styles.nativead}
                onAdLoaded={(adInfo: AdInfo) => {
                    if (adInfo?.nativeAd?.mediaContentAspectRatio) {
                        setAspectRatio(adInfo?.nativeAd?.mediaContentAspectRatio);
                    }
                    log('Native ad loaded from ' + adInfo.networkName);
                    setIsNativeAdLoading(false);
                }}
                onAdLoadFailed={(errorInfo: AdLoadFailedInfo) => {
                    log(
                        'Native ad failed to load with error code ' +
                            errorInfo.code +
                            ' and message: ' +
                            errorInfo.message
                    );
                    setIsNativeAdLoading(false);
                }}
                onAdClicked={(adInfo: AdInfo) => {
                    log('Native ad clicked on ' + adInfo.adUnitId);
                }}
                onAdRevenuePaid={(adInfo: AdRevenueInfo) => {
                    log('Native ad revenue paid: ' + adInfo.revenue);
                }}
            >
                <View style={styles.assetContainer}>
                    <View style={styles.assetUpperContainer}>
                        <IconView style={styles.icon} />
                        <View style={styles.assetTitleContainer}>
                            <TitleView numberOfLines={1} style={styles.title} />
                            <AdvertiserView numberOfLines={1} style={styles.advertiser} />
                            <StarRatingView style={styles.starRatingView} />
                        </View>
                        <OptionsView style={styles.optionsView} />
                    </View>
                    <BodyView numberOfLines={2} style={styles.body} />
                    <MediaView style={{ ...styles.mediaView, ...mediaViewSize }} />
                    <CallToActionView style={styles.callToAction} />
                </View>
            </NativeAdView>
        );
    }, [adUnitId, log, mediaViewSize]);

    return (
        <>
            <AppButton
                title={isNativeAdShowing ? 'Hide Native Ad' : 'Show Native Ad'}
                enabled={isInitialized}
                onPress={() => {
                    setIsNativeAdShowing(!isNativeAdShowing);
                }}
            />
            {isNativeAdShowing && (
                <View style={styles.container}>
                    <NativeAdExample />
                    <AppButton
                        title={'RELOAD'}
                        enabled={!isNativeAdLoading}
                        onPress={() => {
                            setIsNativeAdLoading(true);
                            nativeAdViewRef.current?.loadAd();
                        }}
                    />
                    <AppButton
                        title={'CLOSE'}
                        enabled={!isNativeAdLoading}
                        onPress={() => {
                            setIsNativeAdShowing(!isNativeAdShowing);
                        }}
                    />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute', // must have a view behind for touch event propagation
        top: '30%',
        width: '100%',
        padding: 10,
        backgroundColor: '#0583aa',
        zIndex: 1,
        elevation: Platform.OS === 'android' ? 1 : 0,
    },
    nativead: {
        padding: 10,
        width: '100%',
        backgroundColor: '#EFEFEF',
    },
    icon: {
        width: 48,
        height: 48,
    },
    title: {
        width: 260,
        fontSize: 16,
        textAlign: 'left',
        fontWeight: 'bold',
        color: 'black',
    },
    advertiser: {
        fontSize: 12,
        textAlign: 'left',
        color: 'gray',
    },
    starRatingView: {
        fontSize: 10, // size of each star as unicode symbol
        color: '#ffe234',
        backgroundColor: '#EFEFEF',
    },
    optionsView: {
        width: 20,
        height: 20,
        backgroundColor: '#EFEFEF',
    },
    body: {
        padding: 8,
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    mediaView: {
        alignSelf: 'center',
        width: NATIVE_AD_MEDIAVIEW_WIDTH,
        height: NATIVE_AD_MEDIAVIEW_HEIGHT,
        maxWidth: NATIVE_AD_MEDIAVIEW_WIDTH,
        maxHeight: NATIVE_AD_MEDIAVIEW_HEIGHT,
        zIndex: 1,
        elevation: Platform.OS === 'android' ? 1 : 0,
    },
    callToAction: {
        marginTop: 10,
        padding: 8,
        width: '100%',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'white',
        backgroundColor: '#2d545e',
    },
    assetContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    assetUpperContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    assetTitleContainer: {
        marginLeft: 4,
        flexDirection: 'column',
        flexGrow: 1,
    },
});

export default NativeAdViewExample;
