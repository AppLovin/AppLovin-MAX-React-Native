import * as React from 'react';
import { View, Image, StyleSheet, Appearance } from 'react-native';

const AppLogo = () => {
    const colorScheme = Appearance.getColorScheme();
    const iconColour = { tintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

    return (
        <View style={styles.container}>
            <Image style={[styles.logo, iconColour]} source={require('../resources/applovin_logo.png')} />
        </View>
    );
};

const styles = StyleSheet.create({
    logo: {
        resizeMode: 'stretch',
        width: 235,
        height: 42,
    },
    container: {
        height: 60,
        alignItems: 'center', // horizontal-align
        justifyContent: 'center', // vertical-align
    },
});

export default AppLogo;
