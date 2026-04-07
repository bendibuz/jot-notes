import { JotProps } from "../types/jot";
import { View, Text, Pressable, Alert } from "react-native";
import { ArrowUpFromLine, RotateCcw, Trash2 } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

const INITIAL_LIFETIME_HOURS = 24;
const DECAY_THRESHOLD = 0.01;

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

const confirmDelete = (onDelete: () => void) => {
  Alert.alert(
    "Delete Jot",
    "This can't be undone.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]
  );
};

export const JotComponent: React.FunctionComponent<JotProps> = ({
  id, content, updatedAt, bumpCount = 0, status = "active", onBump, onDelete,
}) => {
  const opacity = relevancyScore(updatedAt, bumpCount);
  const timeLeft = remainingHours(updatedAt, bumpCount);
  const { scheme } = useTheme();

  return (
    <LinearGradient
      colors={[scheme.accent, scheme.dark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ opacity, borderRadius: 10, padding: 2, marginTop: 16, width: '100%' }}
    >
      <View style={{ borderRadius: 8 }} className="p-4 bg-secondary">
        <Text>{content}</Text>
        <View className="flex flex-row justify-between">
          <View className="self-end">
            <Text className="text-xs text-accent">{timeLeft}</Text>
          </View>
          <View className="flex flex-row gap-2">
            <Pressable onPress={onBump} className="p-2 rounded-sm bg-accent">
              {status === "archived"
                ? <RotateCcw size={16} color={scheme.background} />
                : <ArrowUpFromLine size={16} color={scheme.background} />
              }
            </Pressable>
            {status === "archived" && (
              <Pressable onPress={() => onDelete && confirmDelete(onDelete)} className="p-2 rounded-sm bg-accent">
                <Trash2 size={16} color={scheme.background} />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};
