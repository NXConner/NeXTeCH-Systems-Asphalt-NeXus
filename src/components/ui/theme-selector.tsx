import ThemeColorPicker from "./ThemeColorPicker";
import { useState, useEffect } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import React from "react";

export default function ThemeSelector() {
  const [showPicker, setShowPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    const handler = () => setShowModal(false);
    window.addEventListener('theme-changed', handler);
    return () => window.removeEventListener('theme-changed', handler);
  }, []);

  const handleThemeChange = (key: string) => {
    setTheme(key);
    setShowModal(false);
    window.dispatchEvent(new CustomEvent('theme-changed'));
  };

  return (
    <>
      {/* Floating button at top-right */}
      <button
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-accent text-foreground rounded shadow-lg hover:bg-accent/80 transition-all"
        onClick={() => {
          setShowModal(true);
          window.dispatchEvent(new CustomEvent('theme-modal-open'));
        }}
        aria-label="Open Theme Selector"
        title="Open Theme Selector"
      >
        🎨 Theme
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-accent/80 text-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={() => {
                setShowModal(false);
                window.dispatchEvent(new CustomEvent('theme-modal-close'));
              }}
              aria-label="Close Theme Selector"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Theme & Dark Mode</h2>
            <ThemeSwitcher onThemeChange={handleThemeChange} />
            <button
              className="mt-6 w-full px-4 py-2 bg-accent text-white rounded"
              onClick={() => setShowPicker(true)}
            >
              🎨 Custom Colors
            </button>
            {showPicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <ThemeColorPicker onClose={() => setShowPicker(false)} inputTitle="Pick theme color" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 