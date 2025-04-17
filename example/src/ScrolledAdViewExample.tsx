import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions, Platform } from 'react-native';
import { AdFormat, AdView, type AdViewId } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

// Number of times AdViews are repeated in the ScrollView.
// Each repetition includes one Banner AdView and one MREC AdView.
const ADVIEW_REPETITIONS = 2;

const SAMPLE_TEXT = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const ScrolledAdViewExample = ({
    bannerAdUnitId,
    mrecAdUnitId,
    bannerAdViewId,
    bannerAdView2Id,
    mrecAdViewId,
    mrecAdView2Id,
    isInitialized,
    isNativeAdShowing,
}: {
    bannerAdUnitId: string;
    mrecAdUnitId: string;
    bannerAdViewId?: AdViewId;
    bannerAdView2Id?: AdViewId;
    mrecAdViewId?: AdViewId;
    mrecAdView2Id?: AdViewId;
    isInitialized: boolean;
    isNativeAdShowing: boolean;
}) => {
    const [isAdEnabled, setIsAdEnabled] = useState(true);
    const [isScrollViewShowing, setIsScrollViewShowing] = useState(false);

    const renderAdBlock = (key: string, adView: JSX.Element) => (
        <View key={key}>
            <Text style={styles.text}>{SAMPLE_TEXT}</Text>
            {isAdEnabled ? adView : <Text style={styles.placeholder}>AD PLACEHOLDER</Text>}
        </View>
    );

    return (
        <>
            <AppButton
                title={isScrollViewShowing ? 'Hide Scrolled AdViews' : 'Show Scrolled AdViews'}
                enabled={isInitialized && !isNativeAdShowing}
                onPress={() => {
                    setIsScrollViewShowing(!isScrollViewShowing);
                }}
            />
            {isScrollViewShowing && (
                <View style={styles.container}>
                    <ScrollView style={styles.scrollView}>
                        <AppButton title="Close" enabled onPress={() => setIsScrollViewShowing(false)} />
                        <AppButton title={isAdEnabled ? 'Hide Ads' : 'Show Ads'} enabled onPress={() => setIsAdEnabled(!isAdEnabled)} />

                        {Array.from({ length: ADVIEW_REPETITIONS }).flatMap((_, index) => {
                            const keyBase = `block-${index}`;
                            return [
                                renderAdBlock(
                                    `${keyBase}-banner`,
                                    <AdView
                                        adUnitId={bannerAdUnitId}
                                        adFormat={AdFormat.BANNER}
                                        adViewId={index % 2 === 0 ? bannerAdViewId : bannerAdView2Id}
                                        style={styles.adview}
                                    />
                                ),
                                renderAdBlock(
                                    `${keyBase}-mrec`,
                                    <AdView adUnitId={mrecAdUnitId} adFormat={AdFormat.MREC} adViewId={index % 2 === 0 ? mrecAdViewId : mrecAdView2Id} style={styles.adview} />
                                ),
                            ];
                        })}
                    </ScrollView>

                    {isAdEnabled ? <AdView adUnitId={bannerAdUnitId} adFormat={AdFormat.BANNER} style={styles.adview} /> : <Text style={styles.placeholder}>Placeholder</Text>}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: Platform.select({
            ios: Dimensions.get('window').height - 36 - 50,
            android: Dimensions.get('window').height,
        }),
        zIndex: 1,
        elevation: Platform.OS === 'android' ? 1 : 0,
    },
    scrollView: {
        backgroundColor: 'pink',
    },
    text: {
        margin: 4,
        fontSize: 20,
    },
    adview: {
        alignSelf: 'center',
    },
    placeholder: {
        marginTop: 10,
        backgroundColor: 'lightblue',
        fontSize: 40,
        textAlign: 'center',
        height: 50,
    },
});

export default ScrolledAdViewExample;
