import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { NativeAdView, TitleView, AdvertiserView, BodyView, CallToActionView, IconView, OptionsView, MediaView, StarRatingView } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo, NativeAdViewHandler } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

const DEFAULT_ASPECT_RATIO = 16 / 9;

const NativeAdContainer = ({
    adUnitId,
    onLoaded,
    onLoadFailed,
    onClicked,
    onRevenuePaid,
    mediaViewSize,
    setMediaViewContainerSize,
    nativeAdViewRef,
}: {
    adUnitId: string;
    onLoaded: (adInfo: AdInfo) => void;
    onLoadFailed: (errorInfo: AdLoadFailedInfo) => void;
    onClicked: (adInfo: AdInfo) => void;
    onRevenuePaid: (adInfo: AdInfo) => void;
    mediaViewSize: { width?: number; height?: number; aspectRatio?: number };
    setMediaViewContainerSize: (size: { width?: number; height?: number }) => void;
    nativeAdViewRef: React.RefObject<NativeAdViewHandler>;
}) => {
    return (
        <NativeAdView
            adUnitId={adUnitId}
            placement="myplacement"
            customData="mycustomdata"
            ref={nativeAdViewRef}
            style={styles.nativeAdContainer}
            onAdLoaded={onLoaded}
            onAdLoadFailed={onLoadFailed}
            onAdClicked={onClicked}
            onAdRevenuePaid={onRevenuePaid}
        >
            {/* Asset layout */}
            <View style={styles.headerAssetContainer}>
                <IconView style={styles.icon} />
                <View style={styles.titleSectionAssetContainer}>
                    <TitleView numberOfLines={1} style={styles.title} />
                    <AdvertiserView numberOfLines={1} style={styles.advertiser} />
                    <StarRatingView />
                </View>
                <OptionsView style={styles.optionsView} />
            </View>
            <BodyView numberOfLines={2} style={styles.body} />

            {/* Measure the width of the MediaView container */}
            <View
                onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    setMediaViewContainerSize({ width, height });
                }}
                style={styles.mediaViewAssetContainer}
            >
                {/* Dynamically sized MediaView */}
                <MediaView style={{ ...styles.mediaView, ...mediaViewSize }} />
            </View>
            <CallToActionView style={styles.callToAction} />
        </NativeAdView>
    );
};

// A functional component to demonstrate showing a Native Ad using NativeAdView
const NativeAdViewExample = ({
    adUnitId,
    isInitialized,
    log,
    isNativeAdShowing,
    setIsNativeAdShowing,
}: {
    adUnitId: string;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeAdShowing: boolean;
    setIsNativeAdShowing: (showing: boolean) => void;
}) => {
    const [isNativeAdLoading, setIsNativeAdLoading] = useState(false);
    const [mediaViewAspectRatio, setMediaViewAspectRatio] = useState(DEFAULT_ASPECT_RATIO);
    const [mediaViewContainerSize, setMediaViewContainerSize] = useState<{ width?: number; height?: number }>({});
    const [mediaViewSize, setMediaViewSize] = useState<{ width?: number; height?: number }>({});

    const nativeAdViewRef = useRef<NativeAdViewHandler>(null);

    // Adjust MediaView size using container dimensions and ad's aspect ratio
    useEffect(() => {
        if (!mediaViewAspectRatio) return;

        const { width: containerWidth, height: containerHeight } = mediaViewContainerSize;

        if (!containerWidth || !containerHeight) return;

        let height = containerHeight;
        let width = containerHeight * mediaViewAspectRatio;

        if (width > containerWidth) {
            // Adjust again so width is not exceeded
            width = containerWidth;
            height = width / mediaViewAspectRatio;
        }

        const { width: mediaViewWidth, height: mediaViewHeight } = mediaViewSize;

        if (width !== mediaViewWidth || height !== mediaViewHeight) {
            setMediaViewSize({ width, height });
        }
    }, [mediaViewContainerSize, mediaViewAspectRatio, mediaViewSize]);

    return (
        <>
            <AppButton title={isNativeAdShowing ? 'Hide Native Ad' : 'Show Native Ad'} enabled={isInitialized} onPress={() => setIsNativeAdShowing(!isNativeAdShowing)} />

            {isNativeAdShowing && (
                <View style={styles.container}>
                    <NativeAdContainer
                        adUnitId={adUnitId}
                        onLoaded={(adInfo) => {
                            setMediaViewAspectRatio(adInfo?.nativeAd?.mediaContentAspectRatio || DEFAULT_ASPECT_RATIO);
                            log('Native ad loaded from ' + adInfo.networkName);
                            setIsNativeAdLoading(false);
                        }}
                        onLoadFailed={(errorInfo) => {
                            log('Native ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
                            setIsNativeAdLoading(false);
                        }}
                        onClicked={(adInfo) => {
                            log('Native ad clicked on ' + adInfo.adUnitId);
                        }}
                        onRevenuePaid={(adInfo) => {
                            log('Native ad revenue paid: ' + adInfo.revenue);
                        }}
                        mediaViewSize={mediaViewSize}
                        setMediaViewContainerSize={setMediaViewContainerSize}
                        nativeAdViewRef={nativeAdViewRef}
                    />

                    <AppButton
                        title="Reload"
                        enabled={!isNativeAdLoading}
                        onPress={() => {
                            setIsNativeAdLoading(true);
                            nativeAdViewRef.current?.loadAd();
                        }}
                    />
                    <AppButton title="Close" enabled={!isNativeAdLoading} onPress={() => setIsNativeAdShowing(!isNativeAdShowing)} />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute', // must have a view behind for touch event propagation
        top: '30%',
        height: '50%',
        width: '100%',
        padding: 10,
        zIndex: 1,
        elevation: Platform.OS === 'android' ? 1 : 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#0583aa',
    },
    nativeAdContainer: {
        flexGrow: 1,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#EFEFEF',
    },
    headerAssetContainer: {
        flexGrow: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleSectionAssetContainer: {
        marginLeft: 8,
        flex: 1,
        flexDirection: 'column',
    },
    mediaViewAssetContainer: {
        flexGrow: 1,
        width: '100%',
    },
    icon: {
        width: 48,
        height: 48,
    },
    title: {
        fontSize: 12,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    advertiser: {
        fontSize: 10,
        textAlign: 'left',
    },
    optionsView: {
        width: 12,
        height: 12,
    },
    body: {
        flexGrow: 0,
        padding: 4,
        height: 40,
        fontSize: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    mediaView: {
        alignSelf: 'center',
        backgroundColor: '#EFEFEF',
    },
    callToAction: {
        flexGrow: 0,
        marginTop: 10,
        padding: 8,
        width: '100%',
        fontSize: 14,
        textAlign: 'center',
        textTransform: 'uppercase',
        color: 'white',
        backgroundColor: '#2d545e',
    },
});

export default NativeAdViewExample;
