"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StartScreen from "@/components/StartScreen";
import HiraganaGrid from "@/components/HiraganaGrid";
import HiraganaColorPlay from "@/components/HiraganaColorPlay";

type GameState = "start" | "grid" | "color-play";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("start");

  const goToGrid = () => setGameState("grid");
  const goToColorPlay = () => setGameState("color-play");
  const goToStart = () => setGameState("start");

  return (
    <main className="relative min-h-screen bg-pastel-yellow/30 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {gameState === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="py-8 md:py-16">
              <StartScreen onSelectGrid={goToGrid} onSelectColorPlay={goToColorPlay} />
            </div>
          </motion.div>
        )}

        {gameState === "grid" && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="container mx-auto py-8 md:py-16"
          >
            <div className="flex flex-col items-center">
              <div className="w-full flex justify-between items-center px-6 mb-8 max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-black text-primary-soft drop-shadow-sm">
                  ひらがな ひろば
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToStart}
                  className="px-6 py-3 bg-white text-slate-600 rounded-full font-bold shadow-md border-2 border-pastel-pink hover:bg-pastel-pink hover:text-white transition-colors"
                >
                  ◀ もどる
                </motion.button>
              </div>
              <HiraganaGrid />
            </div>
          </motion.div>
        )}

        {gameState === "color-play" && (
          <motion.div
            key="color-play"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <HiraganaColorPlay onBack={goToStart} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Decorative Circles - Persistent across states */}
      <div className="fixed -top-20 -left-20 w-64 h-64 bg-pastel-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
      <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-pastel-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pastel-green rounded-full mix-blend-multiply filter blur-[100px] opacity-10 -z-10" />
    </main>
  );
}
