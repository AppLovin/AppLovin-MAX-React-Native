import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from '../../src/index';
import type {
    AdInfo,
    AdLoadFailedInfo,
    AdRevenueInfo,
    NativeAdViewHandler
} from '../../src/index';
import AppButton from './components/AppButton';

type Props = {
    adUnitId: string;
    isInitialized: boolean;
    log: ((str: string) => void);
    isNativeAdShowing: boolean;
    setIsNativeAdShowing: ((showing: boolean) => void);
};

export const NativeAdViewExample = ({
    adUnitId,
    isInitialized,
    log,
    isNativeAdShowing,
    setIsNativeAdShowing
}: Props) => {

    const DEFAULT_ASPECT_RATIO = (16 / 9);
    const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO);
    const [mediaViewSize, setMediaViewSize] = useState({});
    const [isNativeAdLoading, setIsNativeAdLoading] = useState(false);

    // Ref for NativeAdView
    const nativeAdViewRef = useRef<NativeAdViewHandler>(null);

    // adjust the size of MediaView when `aspectRatio` changes
    useEffect(() => {
        if (aspectRatio > 1) {
            // landscape 
            setMediaViewSize({ aspectRatio: aspectRatio, width: '80%', height: undefined });
        } else {
            // portrait or square
            setMediaViewSize({ aspectRatio: aspectRatio, width: undefined, height: 180 });
        }
    }, [aspectRatio]);

    const NativeAdExample = useCallback(() => {
        return (
            <NativeAdView
                adUnitId={adUnitId}
                placement='myplacement'
                customData='mycustomdata'
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
                    log('Native ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
                    setIsNativeAdLoading(false);
                }}
                onAdClicked={(adInfo: AdInfo) => {
                    log('Native ad clicked on ' + adInfo.adUnitId);
                }}
                onAdRevenuePaid={(adInfo: AdRevenueInfo) => {
                    log('Native ad revenue paid: ' + adInfo.revenue);
                }}
            >
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <IconView style={styles.icon} />
                        <View style={{ flexDirection: 'column', flexGrow: 1 }}>
                            <TitleView style={styles.title} />
                            <AdvertiserView style={styles.advertiser} />
                            <StarRatingView style={styles.starRatingView} />
                        </View>
                        <OptionsView style={styles.optionsView} />
                    </View>
                    <BodyView style={styles.body} />
                    <MediaView style={{ ...styles.mediaView, ...mediaViewSize }} />
                    <CallToActionView style={styles.callToAction} />
                </View>
            </NativeAdView>
        );
    }, []);

    return (
        <>
            <AppButton
                title={isNativeAdShowing ? 'Hide Native Ad' : 'Show Native Ad'}
                enabled={isInitialized}
                onPress={() => {
                    setIsNativeAdShowing(!isNativeAdShowing);
                }}
            />
            {
                isNativeAdShowing &&
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
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: '#0583aa',
        position: 'absolute',
        top: '15%',
        width: '100%',
        paddingBottom: 10,
        zIndex: 1,
        elevation: Platform.OS === 'android' ? 1 : 0,
    },
    nativead: {
        margin: 10,
        padding: 10,
        backgroundColor: '#EFEFEF',
    },
    title: {
        fontSize: 16,
        marginTop: 4,
        marginHorizontal: 5,
        textAlign: 'left',
        fontWeight: 'bold',
        color: 'black',
    },
    icon: {
        margin: 5,
        height: 48,
        aspectRatio: 1,
        borderRadius: 5,
    },
    optionsView: {
        height: 20,
        width: 20,
        backgroundColor: '#EFEFEF',
    },
    starRatingView: {
        marginHorizontal: 5,
        fontSize: 10, // size of each star as unicode symbol
        color: '#ffe234',
        backgroundColor: '#EFEFEF',
    },
    advertiser: {
        marginHorizontal: 5,
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '400',
        color: 'gray',
    },
    body: {
        fontSize: 14,
        marginVertical: 4,
    },
    mediaView: {
        alignSelf: 'center',
        height: 200,
        width: '100%',
        zIndex: 1,
        elevation: Platform.OS === 'android' ? 1 : 0,
    },
    callToAction: {
        padding: 5,
        width: '100%',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'white',
        backgroundColor: '#2d545e',
    },
});

export default NativeAdViewExample;
