import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Question, StructuralType } from '../types';
import { QUESTIONS_BANK } from '../questions';
import { sounds } from '../utils/audio';
import { 
  Code2, Heart, Award, Play, RefreshCw, Sparkles, Check, X, HelpCircle, GraduationCap, Clock, AlertCircle
} from 'lucide-react';

interface PythonGameProps {
  profile: UserProfile;
  onGameComplete: (scores: Record<StructuralType, number>, totalQuestions: number) => void;
  onExit: () => void;
}

export default function PythonGame({ profile, onGameComplete, onExit }: PythonGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [stageScores, setStageScores] = useState<Record<StructuralType, number>>({
    sequence: 0,
    selection: 0,
    repetition: 0,
  });

  // Game flow states
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30.0); // 30 seconds
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Active question references
  useEffect(() => {
    setQuestions(QUESTIONS_BANK);
  }, []);

  const activeQuestion = questions[currentIndex];

  // Prepare and shuffle choices once per question (to avoid jumps on rerender)
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  useEffect(() => {
    if (activeQuestion) {
      // Pick 3 random wrong options
      const shuffledWrong = [...activeQuestion.wrongAnswers]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      // Combine with correct and shuffle
      const combined = [activeQuestion.correctAnswer, ...shuffledWrong]
        .sort(() => 0.5 - Math.random());
      
      setCurrentChoices(combined);
      setTimeRemaining(30.0);
      setSelectedAnswer(null);
      setFeedback(null);
    }
  }, [currentIndex, activeQuestion]);

  // Timer loop tracking
  useEffect(() => {
    if (!gameStarted || isGameOver || !activeQuestion || feedback !== null) return;

    const tickRate = 100; // ms
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, tickRate);

    return () => clearInterval(interval);
  }, [gameStarted, currentIndex, feedback, isGameOver, activeQuestion]);

  const handleTimeout = () => {
    sounds.playFailure();
    setFeedback('timeout');
    setShake(true);

    // Deduct
    setScore(prev => Math.max(0, prev - 5));
    setLives(prev => {
      const nextLives = Math.max(0, prev - 1);
      if (nextLives === 0) {
        setIsGameOver(true);
      }
      return nextLives;
    });

    setTimeout(() => {
      setShake(false);
      setFeedback(null);
      advanceQuestion();
    }, 2500);
  };

  const handleAnswerSelect = (option: string) => {
    if (feedback !== null || selectedAnswer !== null) return; // ignore multiple entries

    setSelectedAnswer(option);
    const isCorrect = option === activeQuestion.correctAnswer;

    if (isCorrect) {
      sounds.playSuccess();
      setFeedback('correct');
      setScore(prev => prev + 15);
      setStageScores(prev => ({
        ...prev,
        [activeQuestion.type]: prev[activeQuestion.type] + 15
      }));

      setTimeout(() => {
        setFeedback(null);
        advanceQuestion();
      }, 1500);
    } else {
      sounds.playFailure();
      setFeedback('wrong');
      setShake(true);
      setScore(prev => Math.max(0, prev - 5));
      setLives(prev => {
        const nextLives = Math.max(0, prev - 1);
        if (nextLives === 0) {
          setIsGameOver(true);
        }
        return nextLives;
      });

      setTimeout(() => {
        setShake(false);
        setFeedback(null);
        advanceQuestion();
      }, 2200);
    }
  };

  const advanceQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Game victory completed!
      sounds.playStageComplete();
      onGameComplete(stageScores, questions.length);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setLives(5);
    setStageScores({ sequence: 0, selection: 0, repetition: 0 });
    setCurrentIndex(0);
    setIsGameOver(false);
    setGameStarted(true);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sequence': return 'from-cyan-500 to-teal-500 text-cyan-400 border-cyan-500/30';
      case 'selection': return 'from-violet-500 to-fuchsia-500 text-violet-400 border-violet-500/30';
      case 'repetition': return 'from-amber-500 to-orange-500 text-amber-400 border-amber-500/30';
      default: return 'from-slate-500 to-slate-600 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative overflow-hidden p-3 md:p-6 transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
      {/* Background decorations conforming to strict guidelines */}
      <div className="absolute top-[10%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

      {/* Profile Header Block */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between mb-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 px-4 py-2.5 rounded-xl text-xs md:text-sm shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 font-bold border border-slate-700/60 font-mono">
            {profile.seatNumber}
          </div>
          <div>
            <div className="font-bold text-slate-200">{profile.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{profile.className}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-cyan-400 text-xs bg-slate-950/40 px-3 py-1 rounded-full border border-slate-800/80">
          <GraduationCap className="w-4 h-4" />
          <span>進度: <strong className="text-slate-100">{currentIndex + 1}</strong> / {questions.length} 題</span>
        </div>

        <button 
          id="exit-game-btn"
          onClick={onExit}
          className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 transition-all cursor-pointer"
        >
          返回首頁
        </button>
      </header>

      {/* Main layout frame */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col gap-4 relative z-10 justify-center">
        {!gameStarted ? (
          /* Landing Stage Briefing */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl mx-auto bg-slate-900/55 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-2xl"
          >
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 mb-4 animate-bounce">
              <Play className="w-6 h-6 fill-current" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-200 mb-2">準備好接受秒速大挑戰了嗎？</h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6">
              本測驗包含 <strong>13 題</strong> 課堂必修 Python 觀念題，涵蓋循序、選擇及重複結構。
              每題有 <strong className="text-amber-400 font-mono">30 秒</strong> 計時限制，請以最敏銳的心智選出正確執行答案！
            </p>

            <div className="w-full text-left bg-slate-950/60 border border-slate-850 rounded-xl p-4 mb-6 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-cyan-400 flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>單選題規則說明：</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li>答對可累積 <strong className="text-emerald-400 font-mono">+15 分</strong>。</li>
                <li>答錯或超時將失去 <strong className="text-rose-400">5 分</strong>，並消耗 1 顆 <strong className="text-rose-500">❤️ 生命值</strong>。</li>
                <li>每題計時柱會在最上方顯示，流逝完畢即判定超時。</li>
              </ul>
            </div>

            <button
              id="begin-challenge-btn"
              onClick={() => setGameStarted(true)}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              啟動測驗與計時！ ⏱️
            </button>
          </motion.div>
        ) : (
          /* Active test view */
          <div className="flex flex-col gap-4">
            {/* Top Stat Boxes & HUD */}
            <div className="grid grid-cols-3 gap-3">
              {/* Score panel */}
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">得分 Score</div>
                  <div className="text-xl font-bold font-mono text-cyan-400">{score}</div>
                </div>
                <Award className="w-7 h-7 text-cyan-400/85" />
              </div>

              {/* Category panel */}
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">課堂單元</div>
                  {activeQuestion && (
                    <div className="text-xs md:text-sm font-bold text-slate-200 truncate max-w-[120px]">{activeQuestion.typeLabel}</div>
                  )}
                </div>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${activeQuestion ? getTypeColor(activeQuestion.type) : ''}`} />
              </div>

              {/* Hearts lives panel */}
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">防禦心心 Hearts</div>
                  <div className="flex gap-0.5 mt-1 text-red-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Heart 
                        key={i} 
                        className={`w-4 h-4 ${i < lives ? 'fill-current text-rose-500' : 'text-slate-700'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing Time Progress Bar */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-xl px-4 py-2 flex items-center justify-between gap-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>TIMER:</span>
                <span className={`font-semibold ${timeRemaining <= 10 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`}>
                  {timeRemaining.toFixed(1)}s
                </span>
              </div>

              <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                <div 
                  className={`h-full transition-all duration-100 ease-linear rounded-full ${
                    timeRemaining <= 10 
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_8px_#f43f5e]' 
                      : 'bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_8px_#06b6d4]'
                  }`}
                  style={{ width: `${(timeRemaining / 30.0) * 100}%` }}
                />
              </div>
            </div>

            {/* Interactive Workspace: Code Terminal & Choices */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Code Terminal (Lines & Editor View) - 7 cols */}
              <div className="md:col-span-7 flex flex-col bg-slate-950 rounded-xl border border-slate-800/90 shadow-lg overflow-hidden relative min-h-[160px] md:min-h-[260px]">
                {/* Visual Feedback Overlay Inside Code Area */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center ${
                        feedback === 'correct' 
                          ? 'bg-emerald-950/80 border border-emerald-500/40' 
                          : feedback === 'timeout'
                            ? 'bg-amber-950/80 border border-amber-500/40'
                            : 'bg-red-950/80 border border-red-500/40'
                      }`}
                    >
                      {feedback === 'correct' ? (
                        <div className="scale-up bg-emerald-500 text-white p-3.5 rounded-full shadow-lg shadow-emerald-500/30">
                          <Check className="w-10 h-10 stroke-[3]" />
                        </div>
                      ) : feedback === 'timeout' ? (
                        <div className="scale-up bg-amber-500 text-white p-3.5 rounded-full shadow-lg shadow-amber-500/30">
                          <AlertCircle className="w-10 h-10 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="scale-up bg-red-500 text-white p-3.5 rounded-full shadow-lg shadow-red-500/30">
                          <X className="w-10 h-10 stroke-[3]" />
                        </div>
                      )}
                      
                      <h3 className="mt-3 text-base font-bold text-slate-100 font-sans px-4">
                        {feedback === 'correct' 
                          ? '正確配對！分數 +15' 
                          : feedback === 'timeout'
                            ? '超時短路！自動扣 5 分'
                            : '計算出錯！扣 5 分'}
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-1 font-mono">
                        正確答案為: <strong className="text-emerald-400">{activeQuestion?.correctAnswer}</strong>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Editor Header Bar */}
                <div className="bg-slate-900 border-b border-slate-800/80 px-3 py-2 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">interactive_sandbox.py</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                </div>

                {/* Editor Code Canvas */}
                <div className="p-4 overflow-auto select-text text-slate-300 leading-relaxed font-mono text-xs md:text-sm flex-1">
                  <table>
                    <tbody>
                      {activeQuestion?.code.split('\n').map((line, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/45">
                          <td className="text-slate-600 text-right pr-4 select-none w-6 border-r border-slate-800/40">{idx + 1}</td>
                          <td className="text-slate-200 whitespace-pre font-mono pl-4">{line}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Choice list - 5 cols */}
              <div className="md:col-span-5 flex flex-col justify-between gap-3">
                <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-xl shadow">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 rounded-full text-[9px] text-cyan-400 font-mono tracking-wider mb-2 uppercase border border-slate-700">
                    QUESTION {currentIndex + 1} DIRECTIVE
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-slate-100 leading-relaxed font-sans">
                    {activeQuestion?.questionText}
                  </h3>
                </div>

                {/* Options List layout */}
                <div className="flex flex-col gap-2.5">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest pl-1">
                    請點選下方一個正確選項：
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {currentChoices.map((option, idx) => {
                      const isOptionSelected = selectedAnswer === option;
                      const isCorrectAnswer = option === activeQuestion?.correctAnswer;
                      
                      // Calculate interactive responsive style
                      let btnStyle = "border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-slate-700 text-slate-200";
                      
                      if (selectedAnswer !== null) {
                        if (isCorrectAnswer) {
                          btnStyle = "border-emerald-500/60 bg-emerald-900/30 text-emerald-300 ring-2 ring-emerald-500/20";
                        } else if (isOptionSelected) {
                          btnStyle = "border-red-500/60 bg-red-900/30 text-red-300 ring-2 ring-red-500/20";
                        } else {
                          btnStyle = "border-slate-850 bg-slate-950/20 text-slate-500 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          id={`option-btn-${idx}`}
                          disabled={selectedAnswer !== null || feedback !== null}
                          onClick={() => handleAnswerSelect(option)}
                          className={`w-full py-3.5 px-4 rounded-xl border text-left text-xs md:text-sm font-semibold transition-all duration-200 active:scale-[0.99] flex items-center justify-between cursor-pointer gap-2 ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2 max-w-[90%]">
                            <span className="font-mono text-[10px] uppercase bg-slate-800/80 px-2 py-0.5 rounded text-slate-400 border border-slate-750">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="font-mono line-clamp-2 leading-tight">{option}</span>
                          </div>

                          {selectedAnswer !== null && isCorrectAnswer && (
                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          )}
                          {selectedAnswer !== null && isOptionSelected && !isCorrectAnswer && (
                            <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual assistance item card context (removes text only feel) */}
            <div className="bg-slate-900/40 p-3.5 border border-slate-800/80 rounded-xl text-xs space-y-1.5 text-slate-400 font-mono">
              <div className="text-[10px] text-cyan-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Python 語法觀念分析器</span>
              </div>
              <p className="text-slate-400 leading-normal font-sans">
                仔細閱讀左列運算代碼，若有 `for` 變數請計算其 index 遞增值。請注意 `**` 為 Python 乘冪運算符，而 `%` 則是求除法餘數！
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Game Over Screen Modal (Lives = 0) */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto mb-4 scale-up">
                <Heart className="w-6 h-6 fill-current animate-pulse text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 font-sans">生命值耗盡！</h2>
              <p className="text-slate-400 text-xs md:text-sm mt-3 leading-relaxed">
                別氣餒！錯誤是邁向傑出程式設計師的階梯。多注意變數型態與 loops 運行規則，立即重啟挑戰吧！
              </p>

              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-850 my-4 text-xs">
                <span className="text-slate-500">目前的學習累計得分</span>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{score} 分</div>
              </div>

              <div className="flex gap-3">
                <button
                  id="gameover-retry-btn"
                  onClick={handleRestart}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm shadow-md transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> 重新出發
                </button>
                <button
                  id="gameover-giveup-btn"
                  onClick={() => {
                    // force end test and compute current points
                    onGameComplete(stageScores, questions.length);
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs md:text-sm border border-slate-700 transition-all cursor-pointer"
                >
                  結算並下載
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
