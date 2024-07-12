import { StyleSheet, Button, Alert, Dimensions, Animated, PanResponder } from 'react-native';
import React, { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ball from '@/components/Ball';
import Platform from '@/components/Platform';
import { Text, View } from '@/components/Themed';

import { Stack } from 'expo-router';

export default function TabThreeScreen() {
    const window = Dimensions.get('window');
    const insets = useSafeAreaInsets();
    const screenWidth = window.width;
    const screenHeight = window.height - insets.top - insets.bottom - 50;

    const OFFSET = 35;
    const BALL_SIZE = 50;
    const initBallPosition = { x: screenWidth / 2 - BALL_SIZE / 2, y: screenHeight / 2 - BALL_SIZE / 2 };
    const PLATFORM_HEIGHT = 20;
    const PLATFORM_LENGTH1 = 100;
    const PLATFORM_LENGTH2 = 100;

    const [myNumber, setMyNumber] = useState(0);
    const [ballPos, setBallPos] = useState(initBallPosition);

    //const P1InitPosition = { x: screenWidth / 2 - PLATFORM_LENGTH1 / 2, y: screenHeight - OFFSET };
    const P2InitPosition = { x: screenWidth / 2 - PLATFORM_LENGTH2 / 2, y: OFFSET };

    //const panP1 = useRef(new Animated.ValueXY()).current;
    const panP2 = useRef(new Animated.ValueXY()).current;

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    //const panResponderP1 = useRef(
    //    PanResponder.create({
    //        onStartShouldSetPanResponder: () => true,
    //        onPanResponderGrant: (evt) => {
    //            const touchX = evt.nativeEvent.pageX;
    //            const newX = clamp(
    //                touchX - PLATFORM_LENGTH1 / 2,
    //                0,
    //                screenWidth - PLATFORM_LENGTH1
    //            );
    //            panP1.x.setValue(newX - P1InitPosition.x);
    //        },
    //        onPanResponderMove: (_, gestureState) => {
    //            const newX = clamp(
    //                P1InitPosition.x + gestureState.dx,
    //                0,
    //                screenWidth - PLATFORM_LENGTH1
    //            );
    //            panP1.x.setValue(newX - P1InitPosition.x);
    //        },
    //        onPanResponderRelease: () => {
    //            panP1.flattenOffset();
    //        },
    //    })
    //).current;

    const panResponderP2 = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const touchX = evt.nativeEvent.pageX;
                const newX = clamp(
                    touchX - PLATFORM_LENGTH1 / 2,
                    0,
                    screenWidth - PLATFORM_LENGTH1
                );
                panP2.x.setValue(newX - P2InitPosition.x);
            },
            onPanResponderMove: (_, gestureState) => {
                const newX = clamp(
                    P2InitPosition.x + gestureState.dx,
                    0,
                    screenWidth - PLATFORM_LENGTH2
                );
                panP2.x.setValue(newX - P2InitPosition.x);
            },
            onPanResponderRelease: () => {
                panP2.flattenOffset();
            },
        })
    ).current;

    const function1 = () => {
        setMyNumber(myNumber + 1);
    }
    
    return (
        <View className="flex-1" style={styles.container} >
            <Stack.Screen options={{ headerShown: false }} />
            <Ball size={BALL_SIZE} position={initBallPosition} />
            <Platform
                length={PLATFORM_LENGTH2}
                height={PLATFORM_HEIGHT}
                initPosition={P2InitPosition}
                panHandlers={panResponderP2.panHandlers}
                pan={panP2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
