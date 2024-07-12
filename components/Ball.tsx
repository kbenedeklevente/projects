import React from 'react';
import { View, Animated } from 'react-native';

export default function Ball(props: { size?: number, position?: {x?: number, y?: number} }) {
    const { size = 10, position: { x = 10, y = 10 } = {} } = props;
    return (
        <Animated.View
            className="bg-red-500 rounded-full absolute"
            style={{
                width: size,
                height: size,
                left: x,
                bottom: y,
            }}
        />
    );
}