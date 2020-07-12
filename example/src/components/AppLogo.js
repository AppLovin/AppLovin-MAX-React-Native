import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const AppLogo = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../resources/applovin_logo.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'stretch',
    width: 235,
    height: 55,
  },
  container: {
    height: 60,
    paddingTop: 10,
    paddingBottom: 50,
    alignItems: 'center', // horizontal-align
    justifyContent: 'center', // vertical-align
  },
});

export default AppLogo;
