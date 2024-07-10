import { StyleSheet, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import ActionButton from '@/components/ActionButton';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabThreeScreen() {
    const [myNumber, setMyNumber] = useState(0);
    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Tab Three</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <EditScreenInfo path="app/(tabs)/three.tsx" />
            <ActionButton title="Joe" onPress={() => setMyNumber(myNumber + 1)}/>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <Text style={{ fontSize: 32 }}>{myNumber}</Text>
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