"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import Matter from 'matter-js';

const HIRAGANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split("");
const COLORS = [
  "var(--color-pastel-pink)",
  "var(--color-pastel-blue)",
  "var(--color-pastel-yellow)",
  "var(--color-pastel-green)",
  "var(--color-pastel-purple)",
  "#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BFBC0", "#A0C4FF", "#BDB2FF", "#FFC6FF"
];

// ユニークIDカウンター（Math.random() の衝突リスクを排除）
let _idCounter = 0;
const genId = () => ++_idCounter;

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
  x: number;
  y: number;
  rotation: number;
  color: string;
  isFilled: boolean;
  body: Matter.Body | null;
}

type Difficulty = 'easy' | 'normal';

interface HiraganaColorPlayProps {
  onBack: () => void;
}

export default function HiraganaColorPlay({ onBack }: HiraganaColorPlayProps) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [chars, setChars] = useState<HiraganaChar[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAllCleared, setIsAllCleared] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const requestRef = useRef<number | null>(null);

  const initPhysics = () => {
    if (!engineRef.current) {
      engineRef.current = Matter.Engine.create({ 
        gravity: { x: 0, y: 0 },
        enableSleeping: false 
      });
      runnerRef.current = Matter.Runner.create();
      Matter.Runner.run(runnerRef.current, engineRef.current);
    }
  };

  const clearPhysics = () => {
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null; // null に戻して再初期化ガードを正常動作させる
    }
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current);
      runnerRef.current = null;
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  };

  const addWalls = () => {
    if (!engineRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const thickness = 200;

    const walls = [
      Matter.Bodies.rectangle(width / 2, height + thickness / 2 - 10, width, thickness, { 
        isStatic: true,
        restitution: 1.0 
      }),
      Matter.Bodies.rectangle(width / 2, -thickness / 2 + 10, width, thickness, { 
        isStatic: true,
        restitution: 1.0 
      }),
      Matter.Bodies.rectangle(-thickness / 2 + 10, height / 2, thickness, height, { 
        isStatic: true,
        restitution: 1.0 
      }),
      Matter.Bodies.rectangle(width + thickness / 2 - 10, height / 2, thickness, height, { 
        isStatic: true,
        restitution: 1.0 
      }),
    ];
    Matter.World.add(engineRef.current.world, walls);
  };

  // パーティクル生成ヘルパー（重複コードを統合）
  const spawnParticles = useCallback((x: number, y: number, color: string | null, count: number) => {
    const newParticles: Particle[] = Array.from({ length: count }, () => ({
      id: genId(),
      x,
      y,
      color: color ?? COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1000);
  }, []);

  const generateNewChars = (diff: Difficulty) => {
    setIsAllCleared(false);
    clearPhysics();
    initPhysics();
    addWalls();

    const selectedCount = diff === 'easy' ? 6 : 14;
    const shuffled = [...HIRAGANA].sort(() => 0.5 - Math.random());
    const selectedCharsBase = shuffled.slice(0, selectedCount);
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const padding = 200;

    const newChars: HiraganaChar[] = selectedCharsBase.map((char) => {
      const x = Math.random() * (width - padding * 2) + padding;
      const y = Math.random() * (height - padding * 2) + padding;
      const radius = 65;

      const body = Matter.Bodies.circle(x, y, radius, {
        restitution: 1.0, // 1.0に抑えてエネルギー増幅による無限加速を防ぐ
        friction: 0.05,
        frictionAir: 0.02,
        density: 0.001,
        label: char,
      });

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5
      });

      Matter.World.add(engineRef.current!.world, body);

      return {
        id: genId(), // ユニークIDで衝突リスクを排除
        text: char,
        x,
        y,
        rotation: (Math.random() * 30 - 15) * (Math.PI / 180),
        color: 'transparent', 
        isFilled: false,
        body,
      };
    });

    setChars(newChars);

    const update = () => {
      setChars(prev => prev.map(c => {
        if (!c.body) return c;
        return {
          ...c,
          x: c.body.position.x,
          y: c.body.position.y,
          rotation: c.body.angle,
        };
      }));
      requestRef.current = requestAnimationFrame(update);
    };
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    setIsReady(true);
    return () => clearPhysics();
  }, []);

  // useCallback で安定化し、useEffect の依存関係を正しく管理
  const handleSuccess = useCallback(() => {
    const launch = () => {
      const centerX = Math.random() * window.innerWidth;
      const centerY = Math.random() * window.innerHeight * 0.5 + 200;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const newSparks: Particle[] = Array.from({ length: 30 }, () => ({
        id: genId(),
        x: centerX,
        y: centerY,
        color,
        rotation: Math.random() * 360,
      }));
      setParticles(prev => [...prev, ...newSparks]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newSparks.some(ns => ns.id === p.id)));
      }, 1500);
    };
    launch();
    setTimeout(launch, 400);
    setTimeout(launch, 800);

    const audio = new Audio('/success.mp3');
    audio.play().catch(() => {
      if ("speechSynthesis" in window) {
        const uttr = new SpeechSynthesisUtterance("すごーい！できたね！");
        uttr.lang = "ja-JP";
        uttr.rate = 1.0;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(uttr);
      }
    });
  }, []);

  useEffect(() => {
    if (chars.length > 0 && chars.every(c => c.isFilled) && !isAllCleared) {
      setIsAllCleared(true);
      handleSuccess();
    }
  }, [chars, isAllCleared, handleSuccess]);

  const playAudio = (file: string, fallbackText: string) => {
    const audio = new Audio(`/${file}`);
    audio.play().catch(() => speak(fallbackText));
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

  // isSwipe 引数を削除（デッドコードを排除）
  const handleCharInteraction = (id: number, x: number, y: number) => {
    const targetIndex = chars.findIndex(c => c.id === id);
    if (targetIndex === -1) return;
    const target = chars[targetIndex];

    if (target.body) {
      // 強く弾ませる（全文字共通）
      Matter.Body.applyForce(target.body, target.body.position, {
        x: (Math.random() - 0.5) * 0.8,
        y: (Math.random() - 0.5) * 0.8
      });
    }

    if (!target.isFilled) {
      const popNum = Math.floor(Math.random() * 6) + 1;
      playAudio(`pop${popNum}.mp3`, target.text);

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

      spawnParticles(x, y, null, 15); // ランダムカラーのパーティクル
    } else {
      // 既に埋まっている場合もパーティクル＋サウンドで弾ける演出
      const popNum = Math.floor(Math.random() * 6) + 1;
      playAudio(`pop${popNum}.mp3`, target.text);
      spawnParticles(x, y, target.color, 12); // その文字自身の色でパーティクル
    }
  };

  const selectLevel = (level: Difficulty) => {
    setDifficulty(level);
    generateNewChars(level);
  };

  const refreshGame = () => {
    if (difficulty) {
      generateNewChars(difficulty);
    }
  };

  // PanInfo 型を使用（any を排除）
  const handleDrag = (body: Matter.Body | null, info: PanInfo) => {
    if (!body) return;
    Matter.Body.setPosition(body, {
      x: body.position.x + info.delta.x,
      y: body.position.y + info.delta.y
    });
    Matter.Body.setVelocity(body, { 
      x: info.delta.x * 0.5, 
      y: info.delta.y * 0.5 
    });
  };

  const handleDragEnd = (body: Matter.Body | null, info: PanInfo) => {
    if (!body) return;
    // 投げた時の勢い（velocity）を物理エンジンに反映
    Matter.Body.setVelocity(body, {
      x: info.velocity.x * 0.015,
      y: info.velocity.y * 0.015
    });
  };

  if (!isReady) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none bg-pastel-blue/20 font-rounded">
      <AnimatePresence>
        {!difficulty ? (
          <motion.div 
            key="level-select"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 z-50 bg-white/40 backdrop-blur-sm"
          >
            <h2 className="text-4xl md:text-6xl font-black text-slate-700 mb-12 drop-shadow-sm">どのくらい あそぶ？</h2>
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl">
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => selectLevel('easy')} className="flex-1 bg-white p-10 rounded-[40px] shadow-xl border-4 border-pastel-green group">
                <div className="text-6xl mb-4">🐤</div>
                <div className="text-3xl font-black text-slate-800">やさしい</div>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => selectLevel('normal')} className="flex-1 bg-white p-10 rounded-[40px] shadow-xl border-4 border-pastel-purple group">
                <div className="text-6xl mb-4">🦁</div>
                <div className="text-3xl font-black text-slate-800">ふつう</div>
              </motion.button>
            </div>
            <button onClick={onBack} className="mt-12 text-slate-500 font-bold hover:underline">◀ メニューに もどる</button>
          </motion.div>
        ) : (
          <div className="relative h-screen w-full">
            <div className="absolute top-6 left-6 z-50 pointer-events-none">
              <div className="bg-white/90 px-6 py-3 rounded-full border-2 border-primary-soft shadow-md">
                <span className="text-xl font-black text-slate-700">🎨 ぬったよ！ </span>
                <span className="text-2xl font-black text-primary-soft">
                  {chars.filter(c => c.isFilled).length}
                </span>
                <span className="text-xl font-black text-slate-400"> / {chars.length}</span>
              </div>
            </div>

            <div className="absolute top-6 right-6 flex gap-3 z-50 pointer-events-auto">
              <button onClick={refreshGame} className="px-6 py-3 bg-white/90 text-primary-soft rounded-full text-lg font-bold border-2 border-primary-soft shadow-md hover:scale-105 active:scale-95 transition-all">🔄 べつの文字</button>
              <button onClick={() => setDifficulty(null)} className="px-6 py-3 bg-slate-100/80 text-slate-500 rounded-full text-lg font-bold border border-slate-300 shadow-sm transition-all text-sm">◀ もどる</button>
            </div>

            <AnimatePresence>
              {chars.map((char) => (
                <motion.div
                  key={char.id}
                  drag
                  dragMomentum={false} 
                  onDragEnd={(e, info) => handleDragEnd(char.body, info)}
                  onDrag={(e, info) => handleDrag(char.body, info)}
                  onTap={(e, info) => handleCharInteraction(char.id, info.point.x, info.point.y)}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    x: char.x - 100, 
                    y: char.y - 100,
                    rotate: char.rotation * (180 / Math.PI),
                  }}
                  whileHover={{ scale: 1.05, cursor: "grab" }}
                  whileDrag={{ scale: 1.1, zIndex: 100, cursor: "grabbing" }}
                  className="touch-none select-none p-8"
                >
                  <span 
                    className="text-[120px] md:text-[200px] font-black pointer-events-none drop-shadow-xl"
                    style={{
                      WebkitTextStroke: char.isFilled ? '10px #444' : '6px #ccc', 
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

            <AnimatePresence>
              {isAllCleared && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center z-[200] pointer-events-none"
                >
                  <button onClick={refreshGame} className="pointer-events-auto text-6xl md:text-8xl font-black text-white bg-primary-soft px-12 py-8 rounded-full border-8 border-white shadow-2xl drop-shadow-[0_0_20px_rgba(255,143,163,0.5)]">
                    すごーい！✨
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {particles.map((p) => (
              <motion.div 
                key={p.id} initial={{ opacity: 1, scale: 0.2, x: p.x, y: p.y }}
                animate={{ opacity: 0, scale: [0.2, 1.5, 0.5], x: p.x + (Math.random() - 0.5) * 400, y: p.y + (Math.random() - 0.5) * 400 }}
                style={{ position: 'absolute', width: '24px', height: '24px', backgroundColor: p.color, borderRadius: '50%' }}
                className="pointer-events-none"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
