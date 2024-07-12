import React from 'react';
import { Animated } from 'react-native';

export default function Ball(props: { 
    size?: number, 
    position?: Animated.ValueXY ,
    color?: string,
}) {
    const { size = 10, position = new Animated.ValueXY({x: 0, y: 0}), color = 'red'} = props;
    
    return (
        <Animated.View
            className="rounded-full absolute"
            style={{
                width: size,
                height: size,
                backgroundColor: color,
                transform: position.getTranslateTransform(),
            }}
        />
    );
}