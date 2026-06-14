import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { BookOpen, Trophy, Play, Star, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onStart: (profile: UserProfile) => void;
}

export default function LoginScreen({ onStart }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('高二1班');
  const [seatNumber, setSeatNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('請輸入姓名！');
      return;
    }
    if (!seatNumber.trim()) {
      setError('請輸入座號！');
      return;
    }
    setError('');
    onStart({
      name: name.trim(),
      className,
      seatNumber: seatNumber.trim()
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />
      
      {/* Foreground Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl relative z-10"
      >
        {/* Header styling */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-full text-cyan-400 mb-3 border border-cyan-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 id="app-title" className="text-2xl md:text-3xl font-bold font-sans tracking-tight bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            ch2: Python 結構化程式設計
          </h1>
          <p className="text-cyan-400/80 font-mono text-sm mt-1 uppercase tracking-wider">
            單選題限時挑戰遊戲
          </p>
          <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
            依據高二資訊科技第二章，請選出正確程式執行結果！
          </p>
        </div>

        {/* Feature/Syllabus Intro card */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 mb-6 text-xs md:text-sm text-slate-300 space-y-2">
          <div className="font-semibold text-cyan-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>核心學習節點：</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-medium">
            <div className="bg-slate-900 border border-slate-800 rounded p-1.5 hover:border-cyan-500/30 transition-colors">
              <span className="text-cyan-400 block font-bold">1. 循序結構</span>
              <span className="text-[10px] text-slate-400">變數、語法運算</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded p-1.5 hover:border-violet-500/30 transition-colors">
              <span className="text-violet-400 block font-bold">2. 選擇結構</span>
              <span className="text-[10px] text-slate-400">if-elif-else 條件</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded p-1.5 hover:border-amber-500/30 transition-colors">
              <span className="text-amber-400 block font-bold">3. 重複結構</span>
              <span className="text-[10px] text-slate-400">for, while, nested</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="class-select" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                班級選擇
              </label>
              <select
                id="class-select"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/60 rounded-lg py-2.5 px-3 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                style={{ fontSize: 'clamp(12px, 14px, 16px)' }}
              >
                <option value="高二1班">高二1班</option>
                <option value="高二2班">高二2班</option>
                <option value="高二3班">高二3班</option>
                <option value="高二4班">高二4班</option>
                <option value="高二5班">高二5班</option>
                <option value="高二資優班">高二資優班</option>
              </select>
            </div>

            <div>
              <label htmlFor="seat-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                座號姓名 / 座號
              </label>
              <input
                id="seat-input"
                type="number"
                min="1"
                max="99"
                placeholder="例如: 08"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/60 rounded-lg py-2 px-3 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                style={{ fontSize: 'clamp(12px, 14px, 16px)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="name-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              姓名
            </label>
            <input
              id="name-input"
              type="text"
              placeholder="請輸入你的中文或英文姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-lg py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
              style={{ fontSize: 'clamp(12px, 14px, 16px)' }}
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-red-400 text-xs md:text-sm font-semibold"
            >
              ⚠️ {error}
            </motion.p>
          )}

          {/* Action button */}
          <button
            id="start-game-btn"
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
          >
            <Play className="w-5 h-5 fill-current" />
            展開學習接接樂！
          </button>
        </form>

        {/* Footer info matching strict visual design guidelines */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-700/40 text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>教育卓越模式</span>
          </div>
          <div>臺北市高中資訊科技實踐教材</div>
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>v2.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
