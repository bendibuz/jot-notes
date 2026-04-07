import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { X, Zap, Archive, Palette, Info, ChevronRight, ChevronLeft, Check } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { ColorScheme } from "../themes";
import { useState } from "react";

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onPress?: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, sublabel, onPress }) => {
  const { scheme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3.5 border-b"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, borderBottomColor: scheme.secondary })}
    >
      <View className="w-8 items-center mr-3">{icon}</View>
      <View className="flex-1">
        <Text className="text-dark">{label}</Text>
        {sublabel && <Text className="text-xs text-accent mt-0.5">{sublabel}</Text>}
      </View>
      <ChevronRight size={16} color={scheme.accent} />
    </Pressable>
  );
};

const SchemeSwatches: React.FC<{ s: ColorScheme }> = ({ s }) => (
  <View className="flex-row gap-1 mr-3">
    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: s.background, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" }} />
    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: s.secondary }} />
    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: s.accent }} />
    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: s.dark }} />
  </View>
);

const ColorThemeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { scheme, schemes, setSchemeId } = useTheme();
  return (
    <View className="flex-1">
      <View
        className="flex-row items-center px-4 py-3 border-b"
        style={{ borderBottomColor: scheme.secondary }}
      >
        <Pressable
          onPress={onBack}
          className="w-9 h-9 rounded-full items-center justify-center border-2 border-accent mr-3"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ChevronLeft size={16} color={scheme.accent} />
        </Pressable>
        <Text className="text-dark text-lg" style={{ fontWeight: "600" }}>Color Scheme</Text>
      </View>

      <ScrollView className="flex-1">
        <View
          className="mt-4 mx-4 rounded-lg overflow-hidden border"
          style={{ borderColor: scheme.secondary }}
        >
          {schemes.map((s, i) => {
            const active = s.id === scheme.id;
            const isLast = i === schemes.length - 1;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSchemeId(s.id)}
                className={`flex-row items-center px-4 py-3.5${isLast ? "" : " border-b"}`}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  borderBottomColor: scheme.secondary,
                })}
              >
                <SchemeSwatches s={s} />
                <Text className="flex-1 text-dark">{s.name}</Text>
                {active && <Check size={16} color={scheme.accent} />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { scheme } = useTheme();
  const [view, setView] = useState<"main" | "colorTheme">("main");

  const handleClose = () => {
    setView("main");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        {view === "colorTheme" ? (
          <ColorThemeView onBack={() => setView("main")} />
        ) : (
          <>
            <View
              className="flex-row items-center justify-between px-4 py-3 border-b"
              style={{ borderBottomColor: scheme.secondary }}
            >
              <Text className="text-dark text-lg" style={{ fontWeight: "600" }}>Settings</Text>
              <Pressable
                onPress={handleClose}
                className="w-9 h-9 rounded-full items-center justify-center border-2 border-accent"
              >
                <X size={16} color={scheme.accent} />
              </Pressable>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
              {/* Upgrade to Pro */}
              <View
                className="mt-6 mx-4 rounded-lg overflow-hidden border border-accent"
                style={{ backgroundColor: scheme.secondary }}
              >
                <Pressable
                  onPress={() => {}}
                  className="flex-row items-center px-4 py-4"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View className="w-8 items-center mr-3">
                    <Zap size={18} color={scheme.dark} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-dark" style={{ fontWeight: "600" }}>Upgrade to Pro</Text>
                    <Text className="text-xs text-accent mt-0.5">Unlock color schemes, projects, and more</Text>
                  </View>
                  <ChevronRight size={16} color={scheme.accent} />
                </Pressable>
              </View>

              {/* Archive Settings */}
              <View
                className="mt-6 mx-4 rounded-lg overflow-hidden border"
                style={{ borderColor: scheme.secondary }}
              >
                <Text className="text-xs text-accent uppercase tracking-widest px-4 pt-3 pb-1">Archive</Text>
                <SettingsRow
                  icon={<Archive size={18} color={scheme.dark} />}
                  label="Archive Settings"
                  sublabel="Auto-archive and retention"
                  onPress={() => {}}
                />
              </View>

              {/* Color Scheme */}
              <View
                className="mt-6 mx-4 rounded-lg overflow-hidden border"
                style={{ borderColor: scheme.secondary }}
              >
                <Text className="text-xs text-accent uppercase tracking-widest px-4 pt-3 pb-1">Appearance</Text>
                <SettingsRow
                  icon={<Palette size={18} color={scheme.dark} />}
                  label="Color Scheme"
                  onPress={() => setView("colorTheme")}
                />
              </View>

              {/* App Info */}
              <View
                className="mt-6 mx-4 rounded-lg overflow-hidden border"
                style={{ borderColor: scheme.secondary }}
              >
                <Text className="text-xs text-accent uppercase tracking-widest px-4 pt-3 pb-1">About</Text>
                <SettingsRow
                  icon={<Info size={18} color={scheme.dark} />}
                  label="App Info"
                  sublabel="Version 1.0.0"
                  onPress={() => {}}
                />
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
};
