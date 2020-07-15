import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const AppButton = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={!props.enabled}
        style={[
          styles.button,
          props.enabled
            ? { backgroundColor: '#DDDDDD' }
            : { backgroundColor: '#EEEEEE' },
        ]}
        onPress={props.onPress}
      >
        <Text
          style={[
            styles.text,
            props.enabled ? { color: 'black' } : { color: 'gray' },
          ]}
        >
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  button: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center', // vertical-align
    alignItems: 'center', // horizontal-align
  },
  text: {
    fontSize: 20,
  },
});

export default AppButton;
