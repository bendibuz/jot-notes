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
        <Pressable className={`${type == "default" ? "bg-accent" : "bg-background"} ${icon} ${style}`} onPress={onPress}>
            <Text className={`${type == "default" ? "text-white" : "text-black"} text-center`}>
                {text}
            </Text>
        </Pressable>
    );
}