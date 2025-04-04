import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions, Platform } from 'react-native';
import { AdFormat, AdView, type AdViewId } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

type Props = {
    bannerAdUnitId: string;
    mrecAdUnitId: string;
    bannerAdViewId?: AdViewId;
    bannerAdView2Id?: AdViewId;
    mrecAdViewId?: AdViewId;
    mrecAdView2Id?: AdViewId;
    isInitialized: boolean;
    isNativeAdShowing: boolean;
};

const ScrolledAdViewExample = ({ bannerAdUnitId, mrecAdUnitId, bannerAdViewId, bannerAdView2Id, mrecAdViewId, mrecAdView2Id, isInitialized, isNativeAdShowing }: Props) => {
    const [isAdEnabled, setIsAdEnabled] = useState(true);
    const [isScrollViewShowing, setIsScrollViewShowing] = useState(false);

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
                        <AppButton
                            title={'CLOSE'}
                            enabled={true}
                            onPress={() => {
                                setIsScrollViewShowing(false);
                            }}
                        />
                        <AppButton
                            title={isAdEnabled ? 'DISABLE ADS' : 'ENABLE ADS'}
                            enabled={true}
                            onPress={() => {
                                setIsAdEnabled(!isAdEnabled);
                            }}
                        />
                        <View>
                            <Text style={styles.text}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                laborum.
                            </Text>

                            {isAdEnabled ? (
                                <AdView adUnitId={bannerAdUnitId} adFormat={AdFormat.BANNER} adViewId={bannerAdViewId} style={styles.adview} />
                            ) : (
                                <Text style={styles.placeholder}>AD PLACEHOLDER</Text>
                            )}

                            <Text style={styles.text}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                laborum.
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.text}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                laborum.
                            </Text>

                            {isAdEnabled ? (
                                <AdView adUnitId={mrecAdUnitId} adFormat={AdFormat.MREC} adViewId={mrecAdViewId} style={styles.adview} />
                            ) : (
                                <Text style={styles.placeholder}>AD PLACEHOLDER</Text>
                            )}

                            <Text style={styles.text}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                laborum.
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.text}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                laborum.
                            </Text>

                            {isAdEnabled ? (
                                <AdView adUnitId={bannerAdUnitId} adFormat={AdFormat.BANNER} adViewId={bannerAdView2Id} style={styles.adview} />
                            ) : (
                                <Text style={styles.placeholder}>AD PLACEHOLDER</Text>
                            )}

                            <Text style={styles.text}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                laborum.
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.text}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                laborum.
                            </Text>

                            {isAdEnabled ? (
                                <AdView adUnitId={mrecAdUnitId} adFormat={AdFormat.MREC} adViewId={mrecAdView2Id} style={styles.adview} />
                            ) : (
                                <Text style={styles.placeholder}>AD PLACEHOLDER</Text>
                            )}

                            <Text style={styles.text}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                laborum.
                            </Text>
                        </View>
                    </ScrollView>
                    {isAdEnabled ? <AdView adUnitId={bannerAdUnitId} adFormat={AdFormat.BANNER} style={styles.adview} /> : <Text style={styles.placeholder}>AD PLACEHOLDER</Text>}
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
        margin: 10,
        fontSize: 20,
    },
    adview: {
        alignSelf: 'center',
        width: 'auto',
        height: 'auto',
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
