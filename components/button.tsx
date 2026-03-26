import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ButtonProps {
    type: string | "default";
    onPress: () => void;
    style?: string;
    icon?: string;
    text?: string;
}

export const Button: React.FC<ButtonProps> = ({ type, icon, style, text, onPress }) => {
    return (
        <Pressable className={`rounded-md p-4 flex justify-center items-center ${type == "default" ? "bg-accent" : "bg-background"} ${icon} ${style}`} onPress={onPress}>
            <Text className={`${type == "default" ? "text-white" : "text-black"} text-center text-lg text-bold`}>
                {text}
            </Text>
        </Pressable>
    );
}