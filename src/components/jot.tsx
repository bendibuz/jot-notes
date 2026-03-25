
import { JotProps } from "../types/jot";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

const fadeStatus = (updatedAt: string, bumpCount: number) => {
  // opac to be a function of bumpCount and updatedAt
  const opac = 0.5
  return opac;
}

const formatDate = (dateTime: string): string => {
  const date = new Date(dateTime);

  // Check for invalid date strings to prevent "Invalid Date" errors
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(',', ' at'); 
};

export const JotComponent: React.FunctionComponent<JotProps> = ({id, content, createdAt, updatedAt, bumpCount = 0, status = "active", onBump }) => {
  return (
    <View className="bg-accent/10 w-full h-fit p-4 mt-2 rounded-md" key={id}>
      <Text>{content}</Text>
      <View className=" flex  flex-row justify-between">
        <View>

          <Text className="text-xs text-gray-400">Published {formatDate(createdAt)}</Text>
          <Text className="text-xs text-gray-400">Last Bumped {formatDate(updatedAt)}</Text>
        </View>
        
        {/* Wire up the onPress here */}
        <View className=" p-2 rounded-sm bg-orange-100">
        <Pressable 
          onPress={onBump}
          className="bg-orange-300 active:bg-orange-500 rounded-full w-6 h-6 self-center"
        />
          <Text className="text-xs text-gray-400 self-end">Bump Ct {bumpCount}</Text>
      </View>
      </View>
    </View>
  )



}