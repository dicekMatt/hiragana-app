"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HIRAGANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split("");
const COLORS = [
  "var(--color-pastel-pink)",
  "var(--color-pastel-blue)",
  "var(--color-pastel-yellow)",
  "var(--color-pastel-green)",
  "var(--color-pastel-purple)",
  "#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BFBC0", "#A0C4FF", "#BDB2FF", "#FFC6FF"
];

interface Position {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
}

interface HiraganaChar {
  id: number;
  text: string;
  left: number;
  top: number;
  rotation: number;
  color: string;
  isFilled: boolean;
}

type Difficulty = 'easy' | 'normal';

interface HiraganaColorPlayProps {
  onBack: () => void;
}

export default function HiraganaColorPlay({ onBack }: HiraganaColorPlayProps) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [chars, setChars] = useState<HiraganaChar[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fireworks, setFireworks] = useState<Particle[]>([]);
  const [isAllCleared, setIsAllCleared] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const constraintsRef = useRef(null);

  const generateNewChars = (diff: Difficulty) => {
    setIsAllCleared(false);
    // 難易度に応じて文字数を変更
    const selectedCount = diff === 'easy' ? Math.floor(Math.random() * 2) + 5 : Math.floor(Math.random() * 4) + 12;
    const shuffled = [...HIRAGANA].sort(() => 0.5 - Math.random());
    const selectedCharsBase = shuffled.slice(0, selectedCount);
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const minDistance = diff === 'easy' ? 180 : 140; // やさしいモードは間隔を広く
    const padding = 120;

    const positions: Position[] = []; 
    for (let i = 0; i < selectedCount; i++) {
      let isOverlapping = true;
      let newPos: Position = { x: 0, y: 0 };
      let attempts = 0;

      while (isOverlapping && attempts < 100) {
        newPos = {
          x: Math.random() * (width - padding * 2) + padding,
          y: Math.random() * (height - padding * 3) + padding * 1.5,
        };
        isOverlapping = positions.some(pos => {
          const dx = pos.x - newPos.x;
          const dy = pos.y - newPos.y;
          return Math.sqrt(dx * dx + dy * dy) < minDistance;
        });
        attempts++;
      }
      positions.push(newPos);
    }

    return selectedCharsBase.map((char, index) => ({
      id: Math.random(),
      text: char,
      left: positions[index].x,
      top: positions[index].y,
      rotation: Math.random() * 30 - 15,
      color: 'transparent', 
      isFilled: false,
    }));
  };

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (chars.length > 0 && chars.every(c => c.isFilled) && !isAllCleared) {
      setIsAllCleared(true);
      handleSuccess();
    }
  }, [chars, isAllCleared]);

  const handleSuccess = () => {
    // 花火エフェクト
    launchFireworks();
    // 成功音
    playAudio('success.mp3', "すごーい！できたね！");
  };

  const launchFireworks = () => {
    const launch = () => {
      const centerX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000);
      const centerY = Math.random() * (typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400) + 200;
      const newSparks: Particle[] = [];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      for (let i = 0; i < 30; i++) {
        newSparks.push({
          id: Math.random(),
          x: centerX,
          y: centerY,
          color: color,
          rotation: Math.random() * 360,
        });
      }
      setFireworks(prev => [...prev, ...newSparks]);
      setTimeout(() => {
        setFireworks(prev => prev.filter(p => !newSparks.some(ns => ns.id === p.id)));
      }, 1500);
    };

    // 複数回打ち上げる
    launch();
    setTimeout(launch, 400);
    setTimeout(launch, 800);
  };

  const playAudio = (file: string, fallbackText: string) => {
    // public フォルダにあるファイルを試行
    const audio = new Audio(`/${file}`);
    audio.play().then(() => {
      // 再生成功
    }).catch(() => {
      // 失敗した場合は Web Speech API
      speak(fallbackText);
    });
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const uttr = new SpeechSynthesisUtterance(text);
      uttr.lang = "ja-JP";
      uttr.rate = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(uttr);
    }
  };

  const handleTap = (id: number, x: number, y: number) => {
    const target = chars.find(c => c.id === id);
    
    if (target) {
      // pop 音（1-6のランダム）
      const popNum = Math.floor(Math.random() * 6) + 1;
      playAudio(`pop${popNum}.mp3`, target.text);
    }

    if (target && !target.isFilled) {
      setChars(prev => prev.map(c => {
        if (c.id === id) {
          return { 
            ...c, 
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            isFilled: true 
          };
        }
        return c;
      }));

      // タップ時のパーティクル
      const particleCount = 15;
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Math.random(),
          x: x,
          y: y,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360,
        });
      }
      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
      }, 1000);
    }
  };

  const selectLevel = (level: Difficulty) => {
    setDifficulty(level);
    setChars(generateNewChars(level));
  };

  const refreshGame = () => {
    if (difficulty) {
      setChars(generateNewChars(difficulty));
    }
  };

  if (!isReady) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none bg-pastel-blue/20 font-rounded">
      <AnimatePresence>
        {!difficulty ? (
          // 難易度選択画面
          <motion.div 
            key="level-select"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 z-50 bg-white/40 backdrop-blur-sm"
          >
            <h2 className="text-4xl md:text-6xl font-black text-slate-700 mb-12 drop-shadow-sm">どのくらい あそぶ？</h2>
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectLevel('easy')}
                className="flex-1 bg-white p-10 rounded-[40px] shadow-xl border-4 border-pastel-green group"
              >
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">🐤</div>
                <div className="text-3xl font-black text-slate-800">やさしい</div>
                <div className="text-slate-500 mt-2">すこしの ひらがな</div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectLevel('normal')}
                className="flex-1 bg-white p-10 rounded-[40px] shadow-xl border-4 border-pastel-purple group"
              >
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">🦁</div>
                <div className="text-3xl font-black text-slate-800">ふつう</div>
                <div className="text-slate-500 mt-2">いっぱいの ひらがな</div>
              </motion.button>
            </div>
            <button 
              onClick={onBack}
              className="mt-12 text-slate-500 font-bold hover:underline"
            >
              ◀ メニューに もどる
            </button>
          </motion.div>
        ) : (
          // ゲーム本編
          <motion.div 
            key="game-play"
            ref={constraintsRef} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="relative h-screen w-full"
          >
            {/* コントロールボタン */}
            <div className="absolute top-6 right-6 flex gap-3 z-50">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshGame} 
                className="px-6 py-3 bg-white/90 text-primary-soft rounded-full text-lg font-bold border-2 border-primary-soft shadow-md hover:bg-white"
              >
                🔄 ちがう文字
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(null)} 
                className="px-6 py-3 bg-slate-100/80 text-slate-500 rounded-full text-lg font-bold border border-slate-300 shadow-sm"
              >
                ◀ レベルを かえる
              </motion.button>
            </div>

            {/* クリア演出 */}
            <AnimatePresence>
              {isAllCleared && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                  transition={{ scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
                  className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none"
                >
                  <div className="pointer-events-auto">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={refreshGame}
                      className="group relative flex flex-col items-center"
                    >
                      <div className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_20px_rgba(255,143,163,0.8)] bg-primary-soft px-12 py-8 rounded-full border-8 border-white shadow-2xl">
                        すごーい！✨
                        <div className="text-3xl mt-4 font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                          次へいく ＞
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ひらがな文字 */}
            <AnimatePresence>
              {chars.map((char) => (
                <motion.div
                  key={char.id}
                  drag
                  dragConstraints={constraintsRef}
                  dragElastic={0.4}
                  dragMomentum={true}
                  initial={{ scale: 0, opacity: 0, rotate: char.rotation + 90 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotate: char.rotation,
                    y: isAllCleared ? [0, -40, 0] : 0,
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    y: { repeat: isAllCleared ? Infinity : 0, duration: 0.8, delay: Math.random() * 0.5 } 
                  }}
                  whileHover={{ scale: 1.1, cursor: "grab" }}
                  whileDrag={{ scale: 1.3, zIndex: 10, cursor: "grabbing" }}
                  onTap={(e, info) => handleTap(char.id, info.point.x, info.point.y)}
                  style={{
                    position: 'absolute',
                    top: `${char.top}px`,
                    left: `${char.left}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="touch-none select-none p-4"
                >
                  <span 
                    className="text-[120px] md:text-[180px] font-black transition-all duration-300 pointer-events-none drop-shadow-md"
                    style={{
                      WebkitTextStroke: char.isFilled ? '8px #444' : '6px #ccc', 
                      color: char.isFilled ? char.color : 'transparent', 
                      display: 'inline-block',
                      textShadow: char.isFilled ? 'none' : '4px 4px 0px rgba(255,255,255,0.8)',
                    }}
                  >
                    {char.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* タップパーティクル */}
            {particles.map((particle) => (
              <motion.div 
                key={particle.id} 
                initial={{ opacity: 1, scale: 0.2, x: particle.x, y: particle.y }} 
                animate={{ 
                  opacity: 0, 
                  scale: [0.2, 1.5, 0.5], 
                  x: particle.x + (Math.random() - 0.5) * 400, 
                  y: particle.y + (Math.random() - 0.5) * 400, 
                  rotate: particle.rotation + 720 
                }} 
                transition={{ duration: 1, ease: 'easeOut' }} 
                style={{ 
                  position: 'absolute', 
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: particle.color, 
                  borderRadius: '50%', 
                  transform: 'translate(-50%, -50%)' 
                }} 
                className="pointer-events-none z-0 shadow-sm" 
              />
            ))}

            {/* 花火エフェクト */}
            {fireworks.map((spark) => (
              <motion.div 
                key={spark.id}
                initial={{ x: spark.x, y: spark.y, opacity: 1, scale: 0.5 }}
                animate={{ 
                  x: spark.x + (Math.random() - 0.5) * 600,
                  y: spark.y + (Math.random() - 0.5) * 600,
                  opacity: 0,
                  scale: 0.1,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  width: '12px',
                  height: '12px',
                  backgroundColor: spark.color,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 10px ${spark.color}, 0 0 20px ${spark.color}`,
                }}
                className="pointer-events-none z-[110]"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
