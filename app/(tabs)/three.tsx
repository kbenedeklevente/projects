import { StyleSheet, Button, Alert, Dimensions, Animated, PanResponder, Easing } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ball from '@/components/Ball';
import Platform from '@/components/Platform';
import { Text, View } from '@/components/Themed';

import { Stack } from 'expo-router';
import ActionButton from '@/components/ActionButton';

export default function TabThreeScreen() {
    const window = Dimensions.get('window');
    const insets = useSafeAreaInsets();
    const screenWidth = window.width;
    const screenHeight = window.height - insets.top - insets.bottom - 50;

    function getRandomBetween(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const OFFSET = 35;
    const BALL_SIZE = 50;
    const initBallPosition = { x: 0, y: 0 };
    const PLATFORM_HEIGHT = 20;
    const PLATFORM_LENGTH1 = 100;
    const PLATFORM_LENGTH2 = 100;

    const gameSpeed = 10;

    const [balls, setBalls] = useState<{ position: { x: number; y: number; }; direction: { x: number; y: number; }; movement: Animated.ValueXY; color: string }[]>([]);
    const [showAddButton, setShowAddButton] = useState(true);

    const P2InitPosition = { x: screenWidth / 2 - PLATFORM_LENGTH2 / 2, y: OFFSET };
    const PlayerPosition = useRef({ x: 0, y: screenHeight / 2 - PLATFORM_HEIGHT });
    const panP2 = useRef(new Animated.ValueXY()).current;

    const initBall = () => ({
        position: initBallPosition,
        direction: { x: getRandomBetween(-1, 1), y: getRandomBetween(-1, 1) },
        movement: new Animated.ValueXY(initBallPosition),
        color: getRandomColor()
    });

    const addBall = () => {
        setBalls(prevBalls => [...prevBalls, initBall()]);
        setShowAddButton(false);
    };

    useEffect(() => {
        const interval = setInterval(moveBalls, 16); // Approximately 60 FPS
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setShowAddButton(balls.length === 0);
    }, [balls]);

    const handlePlatformCollision = (ball: any) => {
        ball.direction.y *= -1;
        ball.position.y = PlayerPosition.current.y - BALL_SIZE / 2;
        ball.direction.x = getRandomBetween(-0.25, 0.25);
        ball.direction.x = Math.max(-1, Math.min(1, ball.direction.x));
        return true;
    };

    const moveBalls = () => {
        setBalls(prevBalls => {
            let shouldAddNewBall = false;
            const updatedBalls = prevBalls.map((ball) => {
                let newX = ball.position.x + ball.direction.x * gameSpeed;
                let newY = ball.position.y + ball.direction.y * gameSpeed;
    
                // Platform collision detection
                const platformY = PlayerPosition.current.y;
                const platformLeftX = PlayerPosition.current.x - PLATFORM_LENGTH2 / 2;
                const platformRightX = PlayerPosition.current.x + PLATFORM_LENGTH2 / 2;
    
                if (newY + BALL_SIZE / 2 >= platformY &&
                    newY - BALL_SIZE / 2 <= platformY + PLATFORM_HEIGHT &&
                    newX + BALL_SIZE / 2 >= platformLeftX &&
                    newX - BALL_SIZE / 2 <= platformRightX) {
                        shouldAddNewBall = handlePlatformCollision(ball);
                }
    
                // Wall collisions
                if (newX <= -screenWidth / 2 + BALL_SIZE / 2 || newX >= screenWidth / 2 - BALL_SIZE / 2) {
                    ball.direction.x *= -1;
                    newX = Math.max(-screenWidth / 2 + BALL_SIZE / 2, Math.min(newX, screenWidth / 2 - BALL_SIZE / 2));
                }
                if (newY <= -screenHeight / 2 + BALL_SIZE / 2) {
                    ball.direction.y *= -1;
                    newY = -screenHeight / 2 + BALL_SIZE / 2;
                }
    
                ball.position = { x: newX, y: newY };
    
                Animated.timing(ball.movement, {
                    toValue: ball.position,
                    duration: 2,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start();
    
                return ball;
            });
    
            // Filter out balls that are out of bounds and add a new ball if needed
            const filteredBalls = updatedBalls.filter(ball => 
                ball.position.y < screenHeight / 2 - BALL_SIZE / 2
            );
    
            if (shouldAddNewBall) {
                filteredBalls.push(initBall());
            }
    
            return filteredBalls;
        });
    };
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
            {balls.map((ball, index) => (
                <Ball key={index} size={BALL_SIZE} position={ball.movement} color={ball.color} />
            ))}
            {showAddButton && (
                <ActionButton
                    title="Add Ball"
                    onPress={addBall}
                />
            )}
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
