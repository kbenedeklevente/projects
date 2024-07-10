import React from 'react';
import { Text, Pressable } from 'react-native';

export default function ActionButton(props: { onPress: () => void; title?: string }) {
  const { onPress, title = 'Save' } = props;
  return (
    <Pressable className="bg-emerald-900 px-14 py-3 rounded-md" onPress={onPress}>
      <Text className="text-white text-4xl">{title}</Text>
    </Pressable>
  );
}
