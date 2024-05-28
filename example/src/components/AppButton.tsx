import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';

type Props = {
    title: string;
    enabled: boolean;
    onPress: () => void;
};

const AppButton = (props: Props & ViewProps) => {
    const { style } = props;
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                disabled={!props.enabled}
                style={[styles.button, props.enabled ? styles.enabledColor : styles.disabledColor, style]}
                onPress={props.onPress}
            >
                <Text style={[styles.text, props.enabled ? styles.blackColor : styles.grayColor, style]}>
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
    enabledColor: {
        backgroundColor: '#DDDDDD',
    },
    disabledColor: {
        backgroundColor: '#EEEEEE',
    },
    blackColor: {
        color: 'black',
    },
    grayColor: {
        color: 'gray',
    },
});

export default AppButton;
