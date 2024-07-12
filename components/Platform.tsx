import React from 'react';
import { Animated, ViewStyle, GestureResponderHandlers } from 'react-native';

interface PlatformProps {
    length?: number;
    height?: number;
    initPosition?: { x: number; y: number };
    style?: ViewStyle;
    panHandlers?: GestureResponderHandlers;
    pan?: Animated.ValueXY;
}

export default function Platform({
    length = 100,
    height = 20,
    initPosition = { x: 0, y: 0 },
    style,
    panHandlers,
    pan = new Animated.ValueXY(),
}: PlatformProps) {
    return (
        <Animated.View
            className="bg-blue-500 absolute rounded-md"
            style={[
                {
                    width: length,
                    height: height,
                    left: Animated.add(initPosition.x, pan.x),
                    bottom: initPosition.y,
                },
                style,
            ]}
            {...panHandlers}
        />
    );
}