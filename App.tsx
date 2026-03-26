import "./global.css";
import { JotComponent } from "./components/jot";
import { JotProps } from "./types/jot";
import { Text, View, TextInput, ScrollView, InputAccessoryView, Dimensions, Animated, Alert } from "react-native";
import { LayoutAnimation, Platform, UIManager, Pressable } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView, Gesture, GestureDetector, PanGesture } from "react-native-gesture-handler";
import { useState, useRef, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { PenTool, FileText, Archive } from 'lucide-react-native';

const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH / 3;
const STORAGE_KEY = "@jot-notes/jots";

function SwipeToArchive({ children, onArchive, viewSwipeGesture }: { children: React.ReactNode; onArchive: () => void; viewSwipeGesture: PanGesture }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const onArchiveRef = useRef(onArchive);
  onArchiveRef.current = onArchive;

  const archiveGesture = useMemo(() =>
    Gesture.Pan()
      .runOnJS(true)
      .activeOffsetX([-15, 15])
      .failOffsetY([-20, 20])
      .onUpdate((e) => {
        if (e.translationX < 0) translateX.setValue(e.translationX);
      })
      .onEnd((e) => {
        if (e.translationX < -SWIPE_THRESHOLD) {
          Animated.timing(translateX, { toValue: -SCREEN_WIDTH, duration: 250, useNativeDriver: true })
            .start(() => onArchiveRef.current());
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      })
      .onFinalize((_, success) => {
        if (!success) Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
      }),
    []
  );

  const raceGesture = useMemo(() => Gesture.Race(archiveGesture, viewSwipeGesture), [archiveGesture, viewSwipeGesture]);

  return (
    <GestureDetector gesture={raceGesture}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
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
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ Caveat_700Bold });
  const [renderView, setRenderView] = useState<"jots" | "archived">("jots");
  const [jots, setJots] = useState<JotProps[]>([]);
  const [staged, setStaged] = useState<string>("");
  const [isInputting, setIsInputting] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);
  const hasLoaded = useRef(false);
  const renderViewRef = useRef(renderView);
  renderViewRef.current = renderView;

  // Gesture.Pan with runOnJS(true) coordinates with UIScrollView on iOS via native
  // gesture recognizers — PanResponder cannot do this (UIScrollView intercepts first).
  const viewSwipeGesture = useMemo(() =>
    Gesture.Pan()
      .runOnJS(true)
      .activeOffsetX([-30, 30])
      .failOffsetY([-15, 15])
      .onEnd((e) => {
        if (e.translationX < -60 && renderViewRef.current === "jots") setRenderView("archived");
        if (e.translationX > 60 && renderViewRef.current === "archived") setRenderView("jots");
      }),
    []
  );

  // Load jots from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          setJots(JSON.parse(raw));
        } catch {
          // corrupt data — start fresh
        }
      }
      hasLoaded.current = true;
    });
  }, []);

  // Persist jots whenever they change, but not before the initial load
  useEffect(() => {
    if (!hasLoaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jots));
  }, [jots]);

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

  const flipArchiveState = (id: string) => {
    setJots(currentJots =>
      currentJots.map(jot =>
        jot.id === id ? { ...jot, status: jot.status === "active" ? "archived" : "active" } : jot
      )
    );
  };

  const deleteJot = (id: string) => {
    setJots(currentJots => currentJots.filter(jot => jot.id !== id));
  };

  const deleteAllArchived = () => {
    Alert.alert(
      "Delete All Archived",
      "This will permanently delete all archived jots. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete All", style: "destructive", onPress: () => setJots(j => j.filter(jot => jot.status !== "archived")) },
      ]
    );
  };

  const header = (
    <View className="flex-row items-center justify-between mb-2">
      <Text style={fontsLoaded ? { fontFamily: 'Caveat_700Bold', fontSize: 36 } : { fontSize: 36, fontWeight: 'bold' }} className="text-dark">Jot Notes</Text>
      <View className="flex-row items-center rounded-full p-0.5 gap-0.5 border-2 border-accent">
        {([{ view: "jots", Icon: FileText }, { view: "archived", Icon: Archive }] as const).map(({ view, Icon }) => {
          const active = renderView === view;
          return (
            <Pressable
              key={view}
              onPress={() => setRenderView(view)}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: active ? '#b4a69b' : 'transparent' }}
            >
              <Icon size={16} color={active ? '#ebe5e0' : '#b4a69b'} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const jotsContent = (
    <>
      {jots.filter(jot => jot.status === "active").length === 0 && renderView === "jots" && (
        <Text className="text-accent italic mt-2">Nothing here yet. Add a note to get started...</Text>
      )}
      {renderView === "jots"
        ? jots.filter(jot => jot.status === "active").map(jot => (
            <SwipeToArchive key={jot.id} onArchive={() => flipArchiveState(jot.id)} viewSwipeGesture={viewSwipeGesture}>
              <JotComponent {...jot} onBump={() => bumpJot(jot.id)} />
            </SwipeToArchive>
          ))
        : jots.filter(jot => jot.status === "archived").map(jot => (
            <JotComponent key={jot.id} {...jot} onBump={() => flipArchiveState(jot.id)} onDelete={() => deleteJot(jot.id)} />
          ))
      }
    </>
  );

  // Android: toggle between centered pen button and input bar; layout resizes via adjustResize
  if (Platform.OS === "android") {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <GestureDetector gesture={viewSwipeGesture}>
          <View className="flex-1 px-4 pt-2">
            {header}
            <ScrollView className="flex-1 w-full" keyboardShouldPersistTaps="handled">
              {jotsContent}
            </ScrollView>
            {renderView === "archived" ? (
              <View className="items-center mb-4">
                {jots.some(jot => jot.status === "archived") && (
                  <Pressable onPress={deleteAllArchived} className="px-6 py-3 rounded-full border border-accent">
                    <Text className="text-accent text-sm">Delete All</Text>
                  </Pressable>
                )}
              </View>
            ) : isInputting ? (
              <View className="flex-row gap-2 pt-2">
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
                <Pressable onPress={addJot} className="p-4 justify-center items-center bg-accent rounded-lg">
                  <PenTool size={18} color="#ebe5e0" />
                </Pressable>
              </View>
            ) : (
              <View className="items-center mb-4">
                <Pressable
                  onPress={() => { setIsInputting(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="w-32 h-32 rounded-3xl bg-accent items-center justify-center"
                >
                  <PenTool size={26} color="#ebe5e0" />
                </Pressable>
              </View>
            )}
          </View>
        </GestureDetector>
      </View>
    );
  }

  // iOS: TextInput lives inside InputAccessoryView — it's native to the keyboard,
  // so the input bar and keyboard rise together with zero lag.
  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <GestureDetector gesture={viewSwipeGesture}>
        <View className="flex-1 px-4 pt-2">
          {header}
          <ScrollView className="flex-1 w-full" keyboardShouldPersistTaps="handled">
            {jotsContent}
          </ScrollView>
          <View className="items-center" style={{ marginBottom: insets.bottom + 16 }}>
            {renderView === "archived" ? (
              jots.some(jot => jot.status === "archived") && (
                <Pressable onPress={deleteAllArchived} className="px-6 py-3 rounded-full border border-accent">
                  <Text className="text-accent text-sm">Delete All</Text>
                </Pressable>
              )
            ) : (
              <Pressable
                onPress={() => setIsInputting(true)}
                className="w-24 h-24 rounded-3xl bg-accent items-center justify-center"
              >
                <PenTool size={26} color="#ebe5e0" />
              </Pressable>
            )}
          </View>
        </View>
      </GestureDetector>

      {isInputting && (
        <InputAccessoryView>
          <View className="flex-row gap-2 p-2 bg-background border-t border-accent">
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
            <Pressable onPress={addJot} className="p-4 justify-center items-center bg-accent rounded-lg">
              <PenTool size={18} color="#ebe5e0" />
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </View>
  );
}
