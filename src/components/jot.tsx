
import { JotProps } from "../types/jot";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

const fadeStatus = (updatedAt: string, bumpCount: number) => {
  // opac to be a function of bumpCount and updatedAt
  const opac = 0.5
  return opac;
}

export const JotComponent: React.FunctionComponent<JotProps> = ({id, content, createdAt, updatedAt, bumpCount = 0, status = "active"}) => {
  return (
    <View className="bg-accent/10 w-1/2 h-fit p-4 mt-2 rounded-md" key = {id}>
        <Text>{content}</Text>
      <View className="flex flex-row  justify-between">
        <View className="">
          <Text className="text-xs text-gray-400">Published {createdAt}</Text>
          <Text className=" text-xs text-gray-400">Last Bumped {updatedAt}</Text>
        </View>
        <Pressable className = " text-xs bg-orange-300 hover:bg-orange-500 rounded-full w-5 h-5 self-end"></Pressable>
      </View>
    </View>
  )



}