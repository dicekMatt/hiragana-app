"use client";

import { motion } from "framer-motion";

interface HiraganaCardProps {
  char: string;
  romaji: string;
  colorClass: string;
}

export default function HiraganaCard({ char, romaji, colorClass }: HiraganaCardProps) {
  const handleClick = () => {
    if ("speechSynthesis" in window) {
      const uttr = new SpeechSynthesisUtterance(char);
      uttr.lang = "ja-JP";
      uttr.rate = 0.8;
      window.speechSynthesis.cancel(); // 連続クリック時の音声重複再生を防ぐ
      window.speechSynthesis.speak(uttr);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`
        w-24 h-24 md:w-32 md:h-32 
        flex flex-col items-center justify-center 
        rounded-3xl shadow-md border-b-4 border-r-4 border-black/10
        ${colorClass} transition-shadow hover:shadow-xl
      `}
    >
      <span className="text-4xl md:text-6xl font-bold text-slate-800 pointer-events-none">
        {char}
      </span>
      <span className="text-xs md:text-sm text-slate-500 font-medium pointer-events-none mt-1 uppercase">
        {romaji}
      </span>
    </motion.button>
  );
}
