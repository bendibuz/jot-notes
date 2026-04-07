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
    background: "#f3eeea",
    secondary: "#f1dacc",
    accent: "#72584b",
    dark: "#1d1a17",
  },
  {
    id: "modern",
    name: "Modern",
    background: "#e8eaed",
    secondary: "#dfd7d1",
    accent: "#f85858",
    dark: "#1a1d21",
  },
  {
    id: "evergreen",
    name: "Evergreen",
    background: "#f5f0eb",
    secondary: "#dbe7dd",
    accent: "#3b5a42",
    dark: "#172019",
  },
  {
    id: "tomato",
    name: "Tomato Time",
    background: "#fcf4f2",
    secondary: "#f0c4bf",
    accent: "#e86256",
    dark: "#1a1a1a",
  },
  {
    id: "eggplant",
    name: "Eggplant",
    background: "#f0ecef",
    secondary: "#dfcccc",
    accent: "#744a56",
    dark: "#2b2431",
  },
];

export const DEFAULT_SCHEME_ID = "warm";
