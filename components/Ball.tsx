import React from 'react';
import { Animated } from 'react-native';

export default function Ball(props: { 
    size?: number, 
    position?: Animated.ValueXY 
}) {
    const { size = 10, position = new Animated.ValueXY({x: 0, y: 0}) } = props;
    
    return (
        <Animated.View
            className="bg-red-500 rounded-full absolute"
            style={{
                width: size,
                height: size,
                transform: position.getTranslateTransform(),
            }}
        />
    );
}