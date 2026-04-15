"use client";

import HiraganaCard from "./HiraganaCard";

const HIRAGANA_DATA = [
  { char: "あ", romaji: "a", color: "bg-pastel-pink" },
  { char: "い", romaji: "i", color: "bg-pastel-blue" },
  { char: "う", romaji: "u", color: "bg-pastel-yellow" },
  { char: "え", romaji: "e", color: "bg-pastel-green" },
  { char: "お", romaji: "o", color: "bg-pastel-purple" },
  { char: "か", romaji: "ka", color: "bg-pastel-pink" },
  { char: "き", romaji: "ki", color: "bg-pastel-blue" },
  { char: "く", romaji: "ku", color: "bg-pastel-yellow" },
  { char: "け", romaji: "ke", color: "bg-pastel-green" },
  { char: "こ", romaji: "ko", color: "bg-pastel-purple" },
  { char: "さ", romaji: "sa", color: "bg-pastel-pink" },
  { char: "し", romaji: "shi", color: "bg-pastel-blue" },
  { char: "す", romaji: "su", color: "bg-pastel-yellow" },
  { char: "せ", romaji: "se", color: "bg-pastel-green" },
  { char: "そ", romaji: "so", color: "bg-pastel-purple" },
  { char: "た", romaji: "ta", color: "bg-pastel-pink" },
  { char: "ち", romaji: "chi", color: "bg-pastel-blue" },
  { char: "つ", romaji: "tsu", color: "bg-pastel-yellow" },
  { char: "て", romaji: "te", color: "bg-pastel-green" },
  { char: "と", romaji: "to", color: "bg-pastel-purple" },
  { char: "な", romaji: "na", color: "bg-pastel-pink" },
  { char: "に", romaji: "ni", color: "bg-pastel-blue" },
  { char: "ぬ", romaji: "nu", color: "bg-pastel-yellow" },
  { char: "ね", romaji: "ne", color: "bg-pastel-green" },
  { char: "の", romaji: "no", color: "bg-pastel-purple" },
  { char: "は", romaji: "ha", color: "bg-pastel-pink" },
  { char: "ひ", romaji: "hi", color: "bg-pastel-blue" },
  { char: "ふ", romaji: "fu", color: "bg-pastel-yellow" },
  { char: "へ", romaji: "he", color: "bg-pastel-green" },
  { char: "ほ", romaji: "ho", color: "bg-pastel-purple" },
  { char: "ま", romaji: "ma", color: "bg-pastel-pink" },
  { char: "み", romaji: "mi", color: "bg-pastel-blue" },
  { char: "む", romaji: "mu", color: "bg-pastel-yellow" },
  { char: "め", romaji: "me", color: "bg-pastel-green" },
  { char: "も", romaji: "mo", color: "bg-pastel-purple" },
  { char: "や", romaji: "ya", color: "bg-pastel-pink" },
  { char: "", romaji: "", color: "" }, // Placeholder for alignment
  { char: "ゆ", romaji: "yu", color: "bg-pastel-yellow" },
  { char: "", romaji: "", color: "" }, // Placeholder for alignment
  { char: "よ", romaji: "yo", color: "bg-pastel-purple" },
  { char: "ら", romaji: "ra", color: "bg-pastel-pink" },
  { char: "り", romaji: "ri", color: "bg-pastel-blue" },
  { char: "る", romaji: "ru", color: "bg-pastel-yellow" },
  { char: "れ", romaji: "re", color: "bg-pastel-green" },
  { char: "ろ", romaji: "ro", color: "bg-pastel-purple" },
  { char: "わ", romaji: "wa", color: "bg-pastel-pink" },
  { char: "", romaji: "", color: "" }, // Placeholder
  { char: "", romaji: "", color: "" }, // Placeholder
  { char: "", romaji: "", color: "" }, // Placeholder
  { char: "を", romaji: "wo", color: "bg-pastel-purple" },
  { char: "ん", romaji: "n", color: "bg-pastel-pink" },
];

export default function HiraganaGrid() {
  return (
    <div className="grid grid-cols-5 gap-4 md:gap-6 p-4 max-w-4xl mx-auto items-center justify-items-center">
      {HIRAGANA_DATA.map((item, index) => (
        item.char ? (
          <HiraganaCard
            key={item.char}
            char={item.char}
            romaji={item.romaji}
            colorClass={item.color}
          />
        ) : (
          <div key={`empty-${index}`} className="w-24 h-24 md:w-32 md:h-32" />
        )
      ))}
    </div>
  );
}
