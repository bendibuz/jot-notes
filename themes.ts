export interface ColorScheme {
  id: string;
  name: string;
  background: string;
  secondary: string;
  accent: string;
  dark: string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "warm",
    name: "Warm",
    background: "#ebe5e0",
    secondary: "#cec8c4",
    accent: "#a08b63",
    dark: "#1d1a17",
  },
  {
    id: "modern",
    name: "Modern",
    background: "#e8eaed",
    secondary: "#cec8c4",
    accent: "#f85858",
    dark: "#1a1d21",
  },
  {
    id: "sage",
    name: "Sage",
    background: "#e4ebe5",
    secondary: "#dbe7dd",
    accent: "#6aac79",
    dark: "#172019",
  },
  {
    id: "tomato",
    name: "Tomato Time",
    background: "#ecdedb",
    secondary: "#f0c4bf",
    accent: "#e86256",
    dark: "#1a1a1a",
  },
];

export const DEFAULT_SCHEME_ID = "warm";
