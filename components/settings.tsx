import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { X, Zap, Archive, Palette, Info, Lock, ChevronRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  locked?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, sublabel, onPress, locked }) => (
  <Pressable
    onPress={locked ? undefined : onPress}
    className="flex-row items-center px-4 py-3.5 border-b border-accent/30"
    style={({ pressed }) => ({ opacity: pressed && !locked ? 0.7 : 1 })}
  >
    <View className="w-8 items-center mr-3">{icon}</View>
    <View className="flex-1">
      <Text className={locked ? "text-accent" : "text-dark"}>{label}</Text>
      {sublabel && <Text className="text-xs text-accent mt-0.5">{sublabel}</Text>}
    </View>
    {locked ? <Lock size={14} color="#b4a69b" /> : <ChevronRight size={16} color="#b4a69b" />}
  </Pressable>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-accent/30">
          <Text className="text-dark text-lg" style={{ fontWeight: "600" }}>Settings</Text>
          <Pressable
            onPress={onClose}
            className="w-9 h-9 rounded-full items-center justify-center border-2 border-accent"
          >
            <X size={16} color="#b4a69b" />
          </Pressable>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          {/* Upgrade to Pro */}
          <View className="mt-6 mx-4 rounded-lg overflow-hidden border border-accent bg-accent/10">
            <Pressable
              onPress={() => {}}
              className="flex-row items-center px-4 py-4"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View className="w-8 items-center mr-3">
                <Zap size={18} color="#3d3630" />
              </View>
              <View className="flex-1">
                <Text className="text-dark" style={{ fontWeight: "600" }}>Upgrade to Pro</Text>
                <Text className="text-xs text-accent mt-0.5">Unlock color schemes and more</Text>
              </View>
              <ChevronRight size={16} color="#b4a69b" />
            </Pressable>
          </View>

          {/* Archive Settings */}
          <View className="mt-6 mx-4 rounded-lg overflow-hidden border border-accent/40">
            <Text className="text-xs text-accent uppercase tracking-widest px-4 pt-3 pb-1">Archive</Text>
            <SettingsRow
              icon={<Archive size={18} color="#3d3630" />}
              label="Archive Settings"
              sublabel="Auto-archive and retention"
              onPress={() => {}}
            />
          </View>

          {/* Color Scheme */}
          <View className="mt-6 mx-4 rounded-lg overflow-hidden border border-accent/40">
            <Text className="text-xs text-accent uppercase tracking-widest px-4 pt-3 pb-1">Appearance</Text>
            <SettingsRow
              icon={<Palette size={18} color="#b4a69b" />}
              label="Color Scheme"
              sublabel="Available with Pro"
              locked
            />
          </View>

          {/* App Info */}
          <View className="mt-6 mx-4 rounded-lg overflow-hidden border border-accent/40">
            <Text className="text-xs text-accent uppercase tracking-widest px-4 pt-3 pb-1">About</Text>
            <SettingsRow
              icon={<Info size={18} color="#3d3630" />}
              label="App Info"
              sublabel="Version 1.0.0"
              onPress={() => {}}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
