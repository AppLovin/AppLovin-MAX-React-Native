import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const AppButton = (props) => {
  const {style, ...rest} = props;
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        disabled={!props.enabled}
        style={[
          styles.button,
          props.enabled
            ? { backgroundColor: '#DDDDDD' }
            : { backgroundColor: '#EEEEEE' },
          style,
        ]}
        onPress={props.onPress}
      >
        <Text
          style={[
            styles.text,
            props.enabled ? { color: 'black' } : { color: 'gray' },
            style,
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
    paddingTop: 8,
    paddingHorizontal: 40,
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: 'center', // vertical-align
    alignItems: 'center', // horizontal-align
  },
  text: {
    fontSize: 20,
  },
});

export default AppButton;
