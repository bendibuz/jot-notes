import { JotProps } from "../types/jot";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import {ArrowUpFromLine } from "lucide-react-native"

const INITIAL_LIFETIME_HOURS = 24;
const DECAY_THRESHOLD = 0.01;

// Solve for K: threshold = exp(-K * lifetime_minutes), so K = -ln(threshold) / lifetime_minutes
const LIFETIME_MINUTES = INITIAL_LIFETIME_HOURS * 60;
const K = -Math.log(DECAY_THRESHOLD) / LIFETIME_MINUTES;

const relevancyScore = (updatedAt: string, bumpCount: number): number => {
  const minutesSinceUpdate = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60);
  const decaySlowdown = 1 + Math.log1p(bumpCount);
  const score = Math.exp(-K * minutesSinceUpdate / decaySlowdown);
  return Math.min(1.0, Math.max(0.0, score));
};

const remainingHours = (updatedAt: string, bumpCount: number): string => {
  const minutesSinceUpdate = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60);
  const decaySlowdown = 1 + Math.log1p(bumpCount);
  const totalLifetimeMinutes = (-Math.log(DECAY_THRESHOLD) * decaySlowdown) / K;
  const minutesLeft = totalLifetimeMinutes - minutesSinceUpdate;

  if (minutesLeft <= 0) return "Expired";

  const hoursLeft = minutesLeft / 60;

  if (hoursLeft < 1) {
    return `${Math.ceil(minutesLeft)}m left`;
  } else if (hoursLeft < 24) {
    return `${hoursLeft.toFixed(0)}h left`;
  } else {
    return `${(hoursLeft / 24).toFixed(1)}d left`;
  }
};

export const JotComponent: React.FunctionComponent<JotProps> = ({
  id, content, createdAt, updatedAt, bumpCount = 0, status = "active", onBump, relevancy = 1
}) => {
  const opacity = relevancyScore(updatedAt, bumpCount);
  const timeLeft = remainingHours(updatedAt, bumpCount);

  return (
    <View style={{ opacity }} className="bg-accent/20 w-full p-4 mt-4 rounded-lg" key={id}>
      <Text>{content}</Text>
      <View className="flex flex-row justify-between">
        <View className="self-end">
          <Text className="text-xs text-gray-600">{timeLeft}</Text>
        </View>

        <Pressable onPress={onBump} className="text-xs p-2 rounded-sm bg-accent">
          <ArrowUpFromLine size={16} color={"beige"} />
        </Pressable>
      </View>
    </View>
  );
};