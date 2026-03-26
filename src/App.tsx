import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Button } from "./components/button";
import { JotComponent } from "./components/jot";
import { JotProps } from "./types/jot";
import { Text, View, TextInput } from "react-native";
import {LayoutAnimation, Platform, UIManager, Pressable} from "react-native"
import { useState } from "react";
import { v4 as uuid } from 'uuid';
import { PenTool } from 'lucide-react-native';

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}




const createJot = (content: string): JotProps => {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    content,
    createdAt: now,
    updatedAt: now,
    bumpCount: 0,
    relevancy: 1,
    status: "active",
  }
}



export default function App() {
  const [renderView, setRenderView] = useState<string>("jots")
  const [jots, setJots] = useState<JotProps[]>([])
  const [staged, setStaged] = useState<string>("")


  const addJot = () => {
    if (staged.length < 1) return;
    const newJot = createJot(staged)
    setJots(jots => 
      [...jots, newJot]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
    setStaged("")
    };

  const bumpJot = (id: string) => {
    LayoutAnimation.configureNext({
      duration: 350,
      create: { type: "easeInEaseOut", property: "opacity" },
      update: { type: "spring", springDamping: 0.7 },
      delete: { type: "easeInEaseOut", property: "opacity" },
    });

    setJots(currentJots =>
      currentJots
        .map(jot => {
          if (jot.id === id) {
            return {
              ...jot,
              bumpCount: (jot.bumpCount || 0) + 1,
              updatedAt: new Date().toISOString()
            };
          }
          return jot;
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
  };

  const flipArchiveState = (id: string) => {
  setJots(currentJots =>
    currentJots.map(jot =>
      jot.id === id ? { ...jot, status: jot.status == "active" ? "archived" : "active" } : jot
    )
  );
};    

  return (
    <View className="mx-auto mt-12 w-[600px] h-[800px] p-12">
    <View className="flex-1 flex-col text-lg items-start w-full">
      <View className="flex flex-row items-center gap-2 w-full">
  {/* <PenTool size={24} className="text-dark"/> */}
  <Text className="text-dark text-2xl font-semibold font-family-serif">Jot Notes</Text>
</View>
      <View className="w-full">
        <View className="flex flex-1 flex-row gap-2 my-2">
          <TextInput className="flex-1 border border-accent border-2 rounded-lg w-full p-2 bg-white/80 " value={staged} onChangeText = {(e: string)=>{setStaged(e)}} onSubmitEditing={addJot} blurOnSubmit={false}></TextInput>
          <Pressable onPress = {addJot} className="p-4 flex justify-center items-center bg-background rounded-lg"><PenTool /> </Pressable>
        </View>
      </View>
      {renderView == "jots" ? 
        <>
        {jots.filter(jot => jot.status === "active").map((jot) => (
          <JotComponent
            key={jot.id} // Important: moved key here for React list reconciliation
            {...jot}     // Shortcut to pass all props
            onBump={() => bumpJot(jot.id)} 
          />
        ))}
        </>:
        <>
        {jots.filter(jot => jot.status === "archived").map((jot) => (
          <JotComponent
            key={jot.id} // Important: moved key here for React list reconciliation
            {...jot}     // Shortcut to pass all props
            onBump={() => bumpJot(jot.id)} 
          />
        ))}
        </>}
      </View> 
      </View>
  );
}
