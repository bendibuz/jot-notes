import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Button } from "./components/button";
import { JotComponent } from "./components/jot";
import { JotProps } from "./types/jot";
import { Text, View, TextInput } from "react-native";
import { useState } from "react";
import { v4 as uuid } from 'uuid';

const createJot = (content: string): JotProps => {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    content,
    createdAt: now,
    updatedAt: now,
    bumpCount: 0,
    status: "active"
  }
}

export default function App() {
  const [jots, setJots] = useState<JotProps[]>([])
  const [staged, setStaged] = useState<string>("")


  const addJot = () => {
    if (staged.length < 1) return;
    const newJot = createJot(staged)
    setJots(jots => [...jots, newJot]);
    setStaged("")
    };

  return (
    <View className="flex-1 flex-col text-lg items-center justify-center bg-background w-full">
        <Text className="text-accent text-2xl font-semibold">Jot Notes</Text>
      <View className="w-1/2">
        <View className="flex flex-1 flex-row gap-2 ">
          <TextInput className="flex-1 border border-accent border-2 rounded-md w-full p-4 bg-white/80 " value={staged} onChangeText = {(e: string)=>{setStaged(e)}}></TextInput>
          <Button type = "default" text="Jot"  onPress = {addJot}></Button>
        </View>
      </View>
        <>
        {jots.map((jot) => (<JotComponent
            id={jot.id}
            content={jot.content}
            createdAt={jot.createdAt}
            updatedAt={jot.updatedAt}
            bumpCount={jot.bumpCount}
            status={jot.status}
          />
      ))}
        </>
      </View>
  );
}
