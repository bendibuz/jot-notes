# CLAUDE.md — Jot Notes Codebase Guide

## Project Overview

Jot Notes is a React Native app (Expo) where notes ("jots") decay in relevance over time using an exponential decay formula. Users can "bump" notes to reset their freshness. The aesthetic is warm and minimal.

## Tech Stack

- **Framework:** Expo 55 / React Native 0.83.2 / React 19.2.0
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** NativeWind 4.2.3 (Tailwind CSS for React Native)
- **Icons:** lucide-react-native
- **IDs:** uuid v4
- **Animation:** React Native `LayoutAnimation` (Android) + react-native-reanimated (configured, minimal use)
- **Storage:** `@react-native-async-storage/async-storage` and `expo-secure-store` installed but not yet integrated

## Directory Structure

```
/workspaces/jot-notes/
├── src/
│   ├── App.tsx               # Root component — all state lives here
│   ├── index.js              # Expo entry point
│   ├── global.css            # Tailwind import
│   ├── components/
│   │   ├── jot.tsx           # Individual note card
│   │   ├── button.tsx        # Reusable button
│   │   ├── header.tsx        # Placeholder (empty)
│   │   └── footer.tsx        # Placeholder (empty)
│   └── types/
│       └── jot.ts            # TypeScript interfaces
├── app.json                  # Expo config
├── tailwind.config.js        # Color theme + border radius
├── babel.config.js           # Preset: babel-preset-expo + nativewind/babel
├── metro.config.js           # withNativeWind() wrapper
├── tsconfig.json             # extends expo/tsconfig.base, strict: true
└── todo.md                   # Remaining tasks
```

## Data Model

```typescript
interface JotProps {
  id: string;                            // UUID v4
  content: string;                       // User-entered text
  createdAt: string;                     // ISO 8601, set once
  updatedAt: string;                     // ISO 8601, reset on bump
  bumpCount: number;                     // Incremented on each bump
  status: "active" | "archived";
  relevancy: number | 1;                 // Computed, not persisted
  onBump?: () => void;                   // Callback to parent
  archiveReason?: "faded" | "completed";
  archivedAt?: string;                   // ISO 8601, set when archived
}
```

### Jot Lifecycle

1. **Created** — `createJot(content)` in App.tsx: UUID, ISO timestamps, bumpCount=0, status="active", relevancy=1
2. **Active** — displayed in "jots" view, opacity reflects relevancy score, can bump or archive
3. **Archived** — displayed in "archived" view, archiveReason and archivedAt set, can be reactivated

Sort order: always descending by `updatedAt` (active) or `archivedAt` (archived).

## Core Mechanics

### Relevancy / Decay (in `jot.tsx`)

```typescript
const INITIAL_LIFETIME_HOURS = 24;
const DECAY_THRESHOLD = 0.01;
const LIFETIME_MINUTES = INITIAL_LIFETIME_HOURS * 60; // 1440
const K = -Math.log(DECAY_THRESHOLD) / LIFETIME_MINUTES; // ≈ 0.00319

function relevancyScore(updatedAt: string, bumpCount: number): number {
  const minutesSinceUpdate = (Date.now() - new Date(updatedAt).getTime()) / 60000;
  const decaySlowdown = 1 + Math.log(1 + bumpCount);
  const score = Math.exp(-K * minutesSinceUpdate / decaySlowdown);
  return Math.min(1, Math.max(0, score));
}
```

Opacity of a jot card is bound directly to this score. No CSS-based transitions — purely computed at render time.

### Time Remaining (`remainingHours`)

Returns formatted string: `"Xm left"` (< 1h), `"Xh left"` (< 24h), `"X.Xd left"` (≥ 1d), or `"Expired"`.

## State Management

All state lives in `App.tsx` — no Context API, no Redux, no external store.

```typescript
const [renderView, setRenderView] = useState<string>("jots"); // "jots" | "archived"
const [jots, setJots] = useState<JotProps[]>([]);
const [staged, setStaged] = useState<string>("");
```

State update pattern — immutable, functional updates:
```typescript
setJots(jots => jots.map(j => j.id === id ? { ...j, bumpCount: j.bumpCount + 1 } : j));
```

Sort is recalculated after every mutation.

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Component files | kebab-case | `jot.tsx`, `button.tsx` |
| Type files | kebab-case | `jot.ts` |
| Components | PascalCase | `JotComponent`, `Button` |
| Functions | camelCase | `createJot`, `bumpJot`, `flipArchiveState` |
| Constants | UPPER_SNAKE_CASE | `DECAY_THRESHOLD`, `LIFETIME_MINUTES` |
| State vars | camelCase | `renderView`, `staged` |
| Interfaces | PascalCase + `Props` suffix | `JotProps`, `ButtonProps` |
| Status strings | lowercase literals | `"active"`, `"archived"`, `"faded"` |

## Styling Conventions

NativeWind (Tailwind) via `className` prop on all React Native primitives. No `StyleSheet.create()` — all styles are utility classes.

### Color Palette

```javascript
// tailwind.config.js
colors: {
  background: "#ebe5e0",  // warm beige — primary background
  accent:     "#b4a69b",  // warm taupe — accents, borders
  dark:       "#3d3630"   // dark brown — text, primary elements
}
```

Always use these semantic tokens (`bg-background`, `text-dark`, `bg-accent`) rather than Tailwind defaults.

### Common Patterns

```tsx
// Layout
<View className="flex flex-row items-center justify-between p-4">

// Card-like container
<View className="bg-accent/20 rounded-lg border border-accent p-4">

// Primary action button
<Pressable className="bg-accent rounded-sm p-2">
  <Text className="text-white">...</Text>
</Pressable>

// Secondary / neutral button
<Pressable className="bg-background rounded-sm p-2">
  <Text className="text-dark">...</Text>
</Pressable>
```

Default border radius is configured globally at `5px` in tailwind config.

### Opacity

Jot opacity is applied via inline `style={{ opacity }}` from the relevancy score — not via Tailwind opacity utilities. Keep dynamic computed values in `style`, static presentation in `className`.

## Component Patterns

### Functional components with TypeScript interfaces

```typescript
interface MyProps {
  id: string;
  onAction?: () => void;
}

const MyComponent: React.FC<MyProps> = ({ id, onAction }) => {
  return <View />;
};

export default MyComponent;
```

### Icons (lucide-react-native)

```tsx
import { ArrowUpFromLine } from "lucide-react-native";
<ArrowUpFromLine size={16} color="#3d3630" />
```

Use `dark` color (`#3d3630`) for icons on light backgrounds. Always pass explicit `size` and `color`.

### Animation (LayoutAnimation)

Used on bump to reorder the list with a spring animation:

```typescript
import { LayoutAnimation, UIManager } from "react-native";
UIManager.setLayoutAnimationEnabledExperimental?.(true); // Android only

LayoutAnimation.configureNext(
  LayoutAnimation.create(300, "easeInEaseOut", "opacity")
);
// or with custom spring:
LayoutAnimation.configureNext({
  duration: 300,
  update: { type: "spring", springDamping: 0.7 }
});
```

Always configure LayoutAnimation _before_ the state update that triggers the re-render.

## What's Not Yet Implemented

These are planned features — don't assume they exist when working on related tasks:

- Persistent storage (AsyncStorage is installed, not wired up)
- 5-second interval to refresh decay calculations
- Settings context menu / color scheme selector

## Key Files to Know

- [src/App.tsx](src/App.tsx) — all state, createJot, addJot, bumpJot, flipArchiveState
- [src/components/jot.tsx](src/components/jot.tsx) — relevancyScore, remainingHours, jot card UI
- [src/components/button.tsx](src/components/button.tsx) — reusable button (currently unused in App)
- [src/types/jot.ts](src/types/jot.ts) — JotProps, ButtonProps interfaces
- [tailwind.config.js](tailwind.config.js) — color tokens
- [todo.md](todo.md) — remaining implementation tasks

## Git Workflow
- Always create a new branch before starting any task
- After completing a task, stage all changes and commit with a descriptive message explaining what was changed and why
- Never commit directly to main