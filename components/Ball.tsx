import React from 'react';
import { Animated, ViewStyle } from 'react-native';

interface BallProps {
    size?: number;
    position?: Animated.ValueXY;
    color?: string;
}

const Ball: React.FC<BallProps> = React.memo(({ 
    size = 10, 
    position = new Animated.ValueXY({x: 0, y: 0}), 
    color = 'red'
}) => {
    const ballStyle: ViewStyle = {
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
        position: 'absolute',
    };

    return (
        <Animated.View
            style={[
                ballStyle,
                { transform: position.getTranslateTransform() }
            ]}
        />
    );
});

export default Ball;