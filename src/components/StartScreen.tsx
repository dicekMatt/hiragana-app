"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onSelectGrid: () => void;
  onSelectColorPlay: () => void;
}

export default function StartScreen({ onSelectGrid, onSelectColorPlay }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary-soft mb-4 drop-shadow-sm">
          ひらがなであそぼう！
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 font-medium">
          たのしく ひらがなを おぼえよう
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* ひらがな ひろば (Grid Mode) */}
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelectGrid}
          className="group relative flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-[40px] shadow-xl border-4 border-pastel-pink transition-colors hover:bg-white"
        >
          <div className="w-24 h-24 mb-6 bg-pastel-pink rounded-full flex items-center justify-center text-5xl shadow-inner group-hover:animate-bounce">
            あ
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-2">ひらがな ひろば</h3>
          <p className="text-slate-500 font-medium">50おんを ならべてみよう</p>
          <div className="absolute -top-4 -right-4 bg-primary-soft text-white text-sm font-bold px-4 py-1 rounded-full shadow-md">
            きほん
          </div>
        </motion.button>

        {/* ひらがな・いろあそび (Color Play Mode) */}
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelectColorPlay}
          className="group relative flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-[40px] shadow-xl border-4 border-pastel-blue transition-colors hover:bg-white"
        >
          <div className="w-24 h-24 mb-6 bg-pastel-blue rounded-full flex items-center justify-center text-5xl shadow-inner group-hover:animate-bounce">
            🎨
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-2">いろあそび</h3>
          <p className="text-slate-500 font-medium">うごかして、いろをぬろう</p>
          <div className="absolute -top-4 -right-4 bg-secondary-soft text-white text-sm font-bold px-4 py-1 rounded-full shadow-md">
            たのしい！
          </div>
        </motion.button>
      </div>
      
      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] text-6xl opacity-10 hidden lg:block"
      >
        あ
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-[5%] text-6xl opacity-10 hidden lg:block"
      >
        い
      </motion.div>
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-40 right-[10%] text-6xl opacity-10 hidden lg:block"
      >
        う
      </motion.div>
    </div>
  );
}
