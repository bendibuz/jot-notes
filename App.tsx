import "./global.css";
import { JotComponent } from "./components/jot";
import { JotProps } from "./types/jot";
import { Text, View, TextInput, ScrollView, InputAccessoryView } from "react-native";
import { LayoutAnimation, Platform, UIManager, Pressable } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { useFonts, Caveat_700Bold } from "@expo-google-fonts/caveat";
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
  const [fontsLoaded] = useFonts({ Caveat_700Bold });
  const [renderView, setRenderView] = useState<string>("jots");
  const [jots, setJots] = useState<JotProps[]>([]);
  const [staged, setStaged] = useState<string>("");
  const [isInputting, setIsInputting] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isInputting) inputRef.current?.focus();
  }, [isInputting]);

  const addJot = () => {
    if (staged.length < 1) return;
    const newJot = createJot(staged);
    setJots(jots =>
      [...jots, newJot]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
    setStaged("");
    setIsInputting(false);
    inputRef.current?.blur();
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

  // Android: toggle between centered pen button and input bar; layout resizes via adjustResize
  if (Platform.OS === "android") {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View className="flex-1 px-4 pt-2">
          <Text style={fontsLoaded ? { fontFamily: 'Caveat_700Bold', fontSize: 36 } : { fontSize: 36, fontWeight: 'bold' }} className="text-dark mb-2">Jot Notes</Text>
          <ScrollView className="flex-1 w-full" keyboardShouldPersistTaps="handled">
            {jots.filter(jot => jot.status === "active").map(jot => (
              <JotComponent key={jot.id} {...jot} onBump={() => bumpJot(jot.id)} />
            ))}
          </ScrollView>
          {isInputting ? (
            <View className="flex flex-row gap-2 pt-2">
              <TextInput
                ref={inputRef}
                className="flex-1 border-2 border-accent rounded-lg p-2 bg-white/80"
                value={staged}
                placeholder="New jot..."
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
            <View className="items-center" style={{ marginBottom: 16 }}>
              <Pressable
                onPress={() => { setIsInputting(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="w-32 h-32 rounded-3xl bg-accent items-center justify-center"
              >
                <PenTool size={26} color="#ebe5e0" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  }

  // iOS: TextInput lives inside InputAccessoryView — it's native to the keyboard,
  // so the input bar and keyboard rise together with zero lag.
  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-1 px-4 pt-2">
        <Text style={fontsLoaded ? { fontFamily: 'Caveat_700Bold', fontSize: 36 } : { fontSize: 36, fontWeight: 'bold' }} className="text-dark mb-2">Jot Notes</Text>
        <ScrollView className="flex-1 w-full" keyboardShouldPersistTaps="handled">
          {jots.filter(jot => jot.status === "active").length === 0 && (
            <Text className="text-accent italic mt-2">Nothing here yet. Add a note to get started...</Text>
          )}
          {renderView === "jots"
            ? jots.filter(jot => jot.status === "active").map(jot => (
                <JotComponent key={jot.id} {...jot} onBump={() => bumpJot(jot.id)} />
              ))
            : jots.filter(jot => jot.status === "archived").map(jot => (
                <JotComponent key={jot.id} {...jot} onBump={() => bumpJot(jot.id)} />
              ))
          }
        </ScrollView>
        <View className="items-center" style={{ marginBottom: insets.bottom + 16 }}>
          <Pressable
            onPress={() => setIsInputting(true)}
            className="w-24 h-24 rounded-3xl bg-accent items-center justify-center"
          >
            <PenTool size={26} color="#ebe5e0" />
          </Pressable>
        </View>
      </View>

      {isInputting && (
        <InputAccessoryView>
          <View className="flex flex-row gap-2 p-2 bg-background border-t border-accent">
            <TextInput
              ref={inputRef}
              className="flex-1 border-2 border-accent rounded-lg p-2 bg-white/80"
              value={staged}
              placeholder="New jot..."
              onChangeText={(e: string) => { setStaged(e); }}
              onSubmitEditing={addJot}
              onBlur={() => { if (staged.length === 0) setIsInputting(false); }}
              blurOnSubmit={false}
            />
            <Pressable onPress={addJot} className="p-4 flex justify-center items-center bg-accent rounded-lg">
              <PenTool size={18} color="#ebe5e0" />
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </View>
  );
}
