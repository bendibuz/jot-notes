# Jot: Hyper-Minimal Note-Taking App Specification

## 1. Overview

Jot is a high-speed, minimal note-taking application designed for immediate idea capture. Its core mechanic revolves around "freshness" — notes fade over time based on inactivity and eventually migrate to an archive.

## 2. Tech Stack

- **Frontend:** React Native (with Expo)
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Backend/Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Anonymous or Social)

## 3. Core Mechanics & Logic

### 3.1 Freshness & Fading

- **Initial State:** A new Jot starts with `opacity: 1.0` and a `bumpCount: 0`.
- **Decay Logic:**
  - Opacity decreases linearly or exponentially based on the time elapsed since the last `updatedAt` timestamp.
  - **Formula Suggestion:** `currentOpacity = Math.max(0.2, 1 - (currentTime - lastUpdatedAt) / decayPeriod)`.
  - `decayPeriod` increases with `bumpCount` (e.g., `baseDecay * (1 + bumpCount * 0.5)`).
- **Inactivity Threshold:** When `currentOpacity` reaches a threshold (e.g., 0.2) or a specific duration passes (e.g., 48 hours of total inactivity), the Jot is automatically moved to the `Archive` with a status of `faded`.

### 3.2 The "Bump"

- **Action:** Tapping the "Spark" icon at the bottom-right of a Jot card.
- **Effect:**
  - Resets `updatedAt` to `currentTime`.
  - Increments `bumpCount`.
  - Resets `opacity` to `1.0`.
  - Moves the Jot back to the top of the "Live Jots" list.

### 3.3 Completion

- **Action:** Swipe gesture on a Jot card.
- **Effect:** Immediately moves the Jot to the `Archive` with a status of `completed` and a green checkmark icon.

## 4. UI/UX Specifications (Based on Design)

### 4.1 Global Styles

- **Universal Border Radius:** `5px`
- **Background Color:** Soft orange/peach (Notepad-like) - e.g., `#FFF5EC`
- **Primary Text/Accent:** Deep orange/brown - e.g., `#964300`
- **Typography:** Consistent size/weight, no italics.
- **Spacing:** Compact padding and minimal vertical gaps between items.

### 4.2 Screens

#### A. Live Jots

- **Input Area:** A borderless or minimal-border text input at the top. Submit happens on 'Enter'.
- **Jot List:** Ordered by `updatedAt` (descending).
- **Jot Card:**
  - Rounded corners (5px).
  - Shading slightly darker than background.
  - "Spark" icon in bottom-right.
  - Opacity of the entire `View` (div) reflects the freshness.

#### B. Archive

- **Header:** "Archive"
- **List:** Ordered by `archivedAt` (descending).
- **Items:**
  - `Completed`: Green checkmark icon.
  - `Faded`: Low opacity, no checkmark.

## 5. Firebase Schema (Firestore)

### Collection: `users/{userId}/jots`

```typescript
interface Jot {
  id: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  bumpCount: number;
  status: "active" | "archived";
  archiveReason?: "faded" | "completed";
  archivedAt?: Timestamp;
}
```

## 6. Implementation Notes for Claude Code

- Use `useEffect` with a `setInterval` (or a background task) to recalculate local opacities for the "fading" effect in real-time.
- For performance, consider calculating the opacity value at render time based on the `updatedAt` timestamp rather than storing changing opacity in the database.
- Use `react-native-reanimated` for smooth swipe-to-complete gestures and opacity transitions.
