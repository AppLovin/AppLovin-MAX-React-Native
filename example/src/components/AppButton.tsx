import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const AppButton = (props:any) => {
  const {style} = props;
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
    paddingHorizontal: 48,
  },
  button: {
    borderRadius: 8,
    height: 36,
    justifyContent: 'center', // vertical-align
    alignItems: 'center', // horizontal-align
  },
  text: {
    fontSize: 18,
  },
});

export default AppButton;
