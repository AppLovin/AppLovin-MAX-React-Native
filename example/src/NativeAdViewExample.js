import React, {forwardRef, useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppLovinMAX from '../../src/index';

export const NativeAdViewExample = forwardRef((props, ref) => {
    const DEFAULT_ASPECT_RATIO = (16/9);
    const {adUnitId} = props;
    const [aspectRatio, setAspectRatio] = useState(1.0);
    const [mediaViewSize, setMediaViewSize] = useState({});

    // adjust the size of MediaView when `aspectRatio` changes
    useEffect(() => {
        if (aspectRatio > 1) {
            // landscape 
            setMediaViewSize({aspectRatio: aspectRatio, width: '80%', height: undefined});
        } else {
            // portrait or square
            setMediaViewSize({aspectRatio: aspectRatio, width: undefined, height: 180});
        }
    }, [aspectRatio]);

    return (
        <AppLovinMAX.NativeAdView
            adUnitId={adUnitId}
            placement='myplacement'
            customData='mycustomdata'
            ref={ref}
            style={styles.nativead}
            onAdLoaded={(adInfo) => {
                if (adInfo.nativeAd.mediaContentAspectRatio) {
                    setAspectRatio(adInfo.nativeAd.mediaContentAspectRatio);
                } else {
                    setAspectRatio(DEFAULT_ASPECT_RATIO);
                }
                props.onStatusText('Native ad loaded from ' + adInfo.networkName);
            }}
            onAdLoadFailed={(errorInfo) => {
                props.onStatusText('Native ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
            }}
            onAdClicked={(adInfo) => {
                props.onStatusText('Native ad clicked');
            }}
            onAdRevenuePaid={(adInfo) => {
                props.onStatusText('Native ad revenue paid: ' + adInfo.revenue);
            }}
            >
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <AppLovinMAX.NativeAdView.IconView style={styles.icon}/>
                    <View style={{flexDirection: 'column', flexGrow: 1}}>
                        <AppLovinMAX.NativeAdView.TitleView style={styles.title}/>
                        <AppLovinMAX.NativeAdView.StarRatingView style={styles.starRatingView}/>
                        <AppLovinMAX.NativeAdView.AdvertiserView style={styles.advertiser}/>
                    </View>
                    <AppLovinMAX.NativeAdView.OptionsView style={styles.optionsView}/>
                </View>
                <AppLovinMAX.NativeAdView.BodyView style={styles.body}/>
                <AppLovinMAX.NativeAdView.MediaView style={{...styles.mediaView, ...mediaViewSize}}/>
                <AppLovinMAX.NativeAdView.CallToActionView style={styles.callToAction}/>
            </View>
        </AppLovinMAX.NativeAdView>
    );
});

const styles = StyleSheet.create({
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
