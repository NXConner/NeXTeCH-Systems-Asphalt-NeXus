import ThemeColorPicker from "./ThemeColorPicker";
import { useState } from "react";

export default function ThemeSelector() {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div>
      <button
        className="ml-2 px-2 py-1 bg-accent text-foreground rounded"
        onClick={() => setShowPicker(v => !v)}
        aria-label="Open Theme Color Picker"
        title="Open Theme Color Picker"
      >
        🎨 Custom Colors
      </button>
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <ThemeColorPicker onClose={() => setShowPicker(false)} inputTitle="Pick theme color" />
        </div>
      )}
    </div>
  );
} 