import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-accent font-semibold">Jot Notes</Text>
      <StatusBar style="auto" />
    </View>
  );
}
