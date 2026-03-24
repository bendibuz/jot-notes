
import Jot from "../types/jot";
import { useState } from "react";

interface JotProps {
  jot: Jot;
  onUpdate: (updatedJot: Jot) => void;
}

const JotComponent: React.FC<JotProps> = ({ jot, onUpdate }) => {
  const [content, setContent] = useState(jot.content);

}