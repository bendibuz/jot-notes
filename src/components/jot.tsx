
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

const relevancyScore = (updatedAt: string, bumpCount: number): number => {
  const hoursSinceUpdate = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60);
  const minutesSinceUpdate = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60);
  // const k = 0.05; // More bumps = slower decay. k controls the base decay rate.
  const k = 0.3; // More bumps = slower decay. k controls the base decay rate.
  const decaySlowdown = 1 + Math.log1p(bumpCount);
  const score = Math.exp(-k * minutesSinceUpdate / decaySlowdown);
  return Math.min(1.0, Math.max(0.0, score));
};

export const JotComponent: React.FunctionComponent<JotProps> = ({id, content, createdAt, updatedAt, bumpCount = 0, status = "active", onBump, relevancy = 1 }) => {
const opacity = relevancyScore(updatedAt, bumpCount)

  return (
    <View style={{opacity}} className="bg-white/50 border-accent border-4 w-full h-fit p-4 mt-2 rounded-md" key={id}>
      <Text>{content}</Text>
      <View className=" flex  flex-row justify-between">
        <View className="self-end">
          <Text className="text-xs text-gray-600">Published {formatDate(createdAt)}</Text>
          <Text className="text-xs text-gray-600">Last Bumped {formatDate(updatedAt)}</Text>
        </View>
        
        {/* Wire up the onPress here */}
        <View className=" p-2 rounded-sm bg-orange-100">
        <Pressable 
          onPress={onBump}
          className="bg-orange-300 active:bg-orange-500 rounded-full w-6 h-6 self-center"
        />
          <Text className="text-xs text-gray-800 self-end">Bump Ct {bumpCount}</Text>
          <Text className="text-xs text-gray-800 self-end">Relevancy {opacity.toFixed(3)}</Text>
      </View>
      </View>
    </View>
  )



}