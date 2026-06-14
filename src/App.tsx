/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, StructuralType } from './types';
import LoginScreen from './components/LoginScreen';
import PythonGame from './components/PythonGame';
import ReportCard from './components/ReportCard';

type GameScreen = 'login' | 'game' | 'report';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('login');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Scoring storage
  const [scores, setScores] = useState<Record<StructuralType, number>>({
    sequence: 0,
    selection: 0,
    repetition: 0
  });
  const [totalQuestions, setTotalQuestions] = useState(13);

  // Handlers
  const handleStartGame = (userProfile: UserProfile) => {
    setProfile(userProfile);
    setScreen('game');
  };

  const handleGameComplete = (finalScores: Record<StructuralType, number>, count: number) => {
    setScores(finalScores);
    setTotalQuestions(count);
    setScreen('report');
  };

  const handleReset = () => {
    setScores({ sequence: 0, selection: 0, repetition: 0 });
    setScreen('login');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <LoginScreen onStart={handleStartGame} />
          </motion.div>
        )}

        {screen === 'game' && profile && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <PythonGame 
              profile={profile} 
              onGameComplete={handleGameComplete} 
              onExit={handleReset} 
            />
          </motion.div>
        )}

        {screen === 'report' && profile && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <ReportCard 
              profile={profile} 
              scores={scores} 
              totalQuestions={totalQuestions} 
              onReset={handleReset} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
