import "./global.css";
import { JotComponent } from "./components/jot";
import { JotProps } from "./types/jot";
import { Text, View, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import { LayoutAnimation, Platform, UIManager, Pressable } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { PenTool } from 'lucide-react-native';

const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

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
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const [renderView, setRenderView] = useState<string>("jots");
  const [jots, setJots] = useState<JotProps[]>([]);
  const [staged, setStaged] = useState<string>("");
  const [isInputting, setIsInputting] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);

  const addJot = () => {
    if (staged.length < 1) return;
    const newJot = createJot(staged);
    setJots(jots =>
      [...jots, newJot]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
    setStaged("");
    setIsInputting(false);
  };

  const openInput = () => {
    setIsInputting(true);
    setTimeout(() => inputRef.current?.focus(), 50);
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
        .map(jot => jot.id === id ? { ...jot, bumpCount: (jot.bumpCount || 0) + 1, updatedAt: new Date().toISOString() } : jot)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 px-4 pt-2">
        <Text className="text-dark text-2xl font-semibold mb-2">Jot Notes</Text>
        <ScrollView className="flex-1 w-full" keyboardShouldPersistTaps="handled">
          {renderView === "jots"
            ? jots.filter(jot => jot.status === "active").map(jot => (
                <JotComponent key={jot.id} {...jot} onBump={() => bumpJot(jot.id)} />
              ))
            : jots.filter(jot => jot.status === "archived").map(jot => (
                <JotComponent key={jot.id} {...jot} onBump={() => bumpJot(jot.id)} />
              ))
          }
        </ScrollView>
        <View className="pt-2" style={{ paddingBottom: insets.bottom }}>
          {isInputting ? (
            <View className="flex flex-row gap-2">
              <TextInput
                ref={inputRef}
                className="flex-1 border-2 border-accent rounded-lg p-2 bg-white/80"
                value={staged}
                onChangeText={(e: string) => { setStaged(e); }}
                onSubmitEditing={addJot}
                onBlur={() => { if (staged.length === 0) setIsInputting(false); }}
                blurOnSubmit={false}
              />
              <Pressable onPress={addJot} className="p-4 flex justify-center items-center bg-accent rounded-lg">
                <PenTool size={18} color="#ebe5e0" />
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={openInput} className="p-4 items-center bg-accent rounded-lg">
              <Text className="text-background font-semibold">Add Jot</Text>
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
