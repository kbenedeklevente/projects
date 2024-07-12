import { StyleSheet, Button, Alert, Dimensions, Animated, PanResponder, Easing } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
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

    function getRandomBetween(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);


    const OFFSET = 35;
    const BALL_SIZE = 50;
    const initBallPosition = { x: 0, y: 0 };
    const PLATFORM_HEIGHT = 20;
    const PLATFORM_LENGTH1 = 100;
    const PLATFORM_LENGTH2 = 100;

    const gameSpeed = 10;

    const ballPosition = useRef(initBallPosition);
    const ballDirection = useRef({ x: 0.5, y: -1 });
    const ballMovement = useRef(new Animated.ValueXY(initBallPosition)).current;

    const P2InitPosition = { x: screenWidth / 2 - PLATFORM_LENGTH2 / 2, y: OFFSET };
    const PlayerPosition = useRef({ x: 0, y: screenHeight / 2 - PLATFORM_HEIGHT   });
    const panP2 = useRef(new Animated.ValueXY()).current;

    const resetBall = () => {
        ballPosition.current = initBallPosition;
        ballDirection.current = { x: getRandomBetween(-1, 1), y: getRandomBetween(-1, 1) };
        ballMovement.setValue(initBallPosition);
    }

    useEffect(() => {
        const interval = setInterval(moveBall, 16); // Approximately 60 FPS
        return () => clearInterval(interval);
    }, []);

    const moveBall = () => {
        let newX = ballPosition.current.x + ballDirection.current.x * gameSpeed;
        let newY = ballPosition.current.y + ballDirection.current.y * gameSpeed;

        const platformY = PlayerPosition.current.y;
        const platformLeftX = PlayerPosition.current.x - PLATFORM_LENGTH2 / 2;
        const platformRightX = PlayerPosition.current.x + PLATFORM_LENGTH2 / 2;

        if (newY + BALL_SIZE / 2 >= platformY &&
            newY - BALL_SIZE / 2 <= platformY + PLATFORM_HEIGHT / 2 &&
            newX + BALL_SIZE / 2 >= platformLeftX &&
            newX - BALL_SIZE / 2 <= platformRightX) {
            ballDirection.current.y *= -1;
            newY = platformY - BALL_SIZE / 2;
            ballDirection.current.x += getRandomBetween(-0.1, 0.1);
            ballDirection.current.x = Math.max(-1, Math.min(1, ballDirection.current.x));
        }

        if (newX <= - screenWidth / 2 + BALL_SIZE / 2 || newX >= screenWidth / 2 - BALL_SIZE / 2) {
            ballDirection.current.x *= -1;
            newX = Math.max(-screenWidth / 2 + BALL_SIZE / 2, Math.min(newX, screenWidth / 2 - BALL_SIZE / 2));
        }
        if (newY <= - screenHeight / 2 + BALL_SIZE / 2) {
            ballDirection.current.y *= -1;
            newY = Math.max(-screenHeight / 2 + BALL_SIZE / 2, Math.min(newY, screenHeight / 2 - BALL_SIZE / 2));
        }
        else if (newY >= screenHeight / 2 - BALL_SIZE / 2) {
            resetBall();
            return;
        }
        ballPosition.current = { x: newX, y: newY };

        Animated.timing(ballMovement, {
            toValue: ballPosition.current,
            duration: 2,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    //const P1InitPosition = { x: screenWidth / 2 - PLATFORM_LENGTH1 / 2, y: screenHeight - OFFSET };
    //const panP1 = useRef(new Animated.ValueXY()).current;
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
                PlayerPosition.current.x = newX - P2InitPosition.x;
            },
            onPanResponderMove: (_, gestureState) => {
                const newX = clamp(
                    P2InitPosition.x + gestureState.dx,
                    0,
                    screenWidth - PLATFORM_LENGTH2
                );
                panP2.x.setValue(newX - P2InitPosition.x);
                PlayerPosition.current.x = newX - P2InitPosition.x;
            },
            onPanResponderRelease: () => {
                panP2.flattenOffset();
            },
        })
    ).current;

    return (
        <View className="flex-1" style={styles.container} >
            <Stack.Screen options={{ headerShown: false }} />
            <Ball size={BALL_SIZE} position={ballMovement} />
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
