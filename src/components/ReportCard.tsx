import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserProfile, StructuralType } from '../types';
import { Download, RefreshCw, Award, ShieldCheck, Calendar, BookOpen, Share2 } from 'lucide-react';

interface ReportCardProps {
  profile: UserProfile;
  scores: Record<StructuralType, number>;
  totalQuestions: number;
  onReset: () => void;
}

export default function ReportCard({ profile, scores, totalQuestions, onReset }: ReportCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const totalScore = scores.sequence + scores.selection + scores.repetition;
  
  // Calculate evaluation level and automatic customized teacher comments
  let evaluation = '甲等';
  let remarks = '';
  
  if (totalScore >= 150) {
    evaluation = '特優 • 程式宗師';
    remarks = '該生在 Python 流程控制（循序、雙向與多向選擇、巢狀 for 迴圈與 while 控制流）的觀念掌握度極佳，表現極為優異，特此嘉獎！';
  } else if (totalScore >= 100) {
    evaluation = '優等 • 程式好手';
    remarks = '該生對 Python 流程分析基本方法已具備紮實概念，能正確運行選擇判斷與 basic loops，實用能力優秀，繼續努力！';
  } else if (totalScore >= 60) {
    evaluation = '甲等 • 初試啼聲';
    remarks = '該生對基礎的 Python 循序與單向選擇結構已有良好體會，但在 range() 數列範圍與 break 次數仍有待進一步熟能生巧。';
  } else {
    evaluation = '乙等 • 再接再厲';
    remarks = '建議多加複習 Python range 數值遞增計算、if...else 的縮排定義與迴圈條件，有恆心朝夢想大步邁進！';
  }

  // Get current beautiful local date string
  const getFormattedDate = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y} 年 ${m} 月 ${day} 日`;
  };

  // Perform Canvas rendering on load/render so the certificate is dynamically generated
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: 800 x 600 (High-res export)
    canvas.width = 800;
    canvas.height = 600;

    // Background filling - soft off-white luxury certificate cream tone
    ctx.fillStyle = '#fafaf9';
    ctx.fillRect(0, 0, 800, 600);

    // Decorative thin elegant outer frame
    ctx.strokeStyle = '#e7e5e4';
    ctx.lineWidth = 15;
    ctx.strokeRect(10, 10, 780, 580);

    // Dynamic inner double border lines (golden/royal blue theme)
    ctx.strokeStyle = '#0284c7'; // royal sky blue border
    ctx.lineWidth = 2.5;
    ctx.strokeRect(26, 26, 748, 548);
    
    ctx.strokeStyle = '#f59e0b'; // amber golden accent border
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 32, 736, 536);

    // Decorative classic corners
    const drawCornerDecoration = (x: number, y: number, r: number) => {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    };
    drawCornerDecoration(32, 32, 10);
    drawCornerDecoration(768, 32, 10);
    drawCornerDecoration(32, 568, 10);
    drawCornerDecoration(768, 568, 10);

    // Header Content
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    
    // Academic Header
    ctx.font = 'bold 16px "Inter", "Microsoft JhengHei", sans-serif';
    ctx.fillText('臺北市高中 111 學年度資訊專題學力證明', 400, 75);

    // Title
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 30px "Inter", "Microsoft JhengHei", sans-serif';
    ctx.fillText('學習成績單暨結業證明書', 400, 120);

    // Subtitle
    ctx.fillStyle = '#475569';
    ctx.font = 'normal 13px "JetBrains Mono", monospace';
    ctx.fillText('CERTIFICATE OF ACADEMIC TRANSCRIPT • PYTHON TIMER QUIZ', 400, 145);

    // Golden Dividers
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 160);
    ctx.lineTo(650, 160);
    ctx.stroke();

    // Student identity area
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px "Microsoft JhengHei", sans-serif';
    
    ctx.fillText(`班級座號：`, 100, 205);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(`${profile.className}   ${profile.seatNumber} 號`, 185, 205);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px "Microsoft JhengHei", sans-serif';
    ctx.fillText(`學生姓名：`, 100, 245);
    
    // Measure student name to prevent cutoff (防跑位/防截字規則)
    ctx.fillStyle = '#0f172a';
    let nameFontSize = 21;
    ctx.font = `bold ${nameFontSize}px "Microsoft JhengHei", sans-serif`;
    while (ctx.measureText(profile.name).width > 240 && nameFontSize > 13) {
      nameFontSize -= 2.5;
      ctx.font = `bold ${nameFontSize}px "Microsoft JhengHei", sans-serif`;
    }
    ctx.fillText(profile.name, 185, 245);

    ctx.fillStyle = '#475569';
    ctx.font = 'normal 13px "Microsoft JhengHei", "JetBrains Mono", monospace';
    ctx.fillText(`測試章節： 第二章 Python 結構化程式設計（循序性、分支選擇、迴圈重複）`, 100, 280);

    // Draw Detailed scores table
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    // Outer Table border
    ctx.strokeRect(100, 310, 600, 120);
    // Grid Dividers
    ctx.beginPath();
    // Headers horizontal dividing line
    ctx.moveTo(100, 345);
    ctx.lineTo(700, 345);
    // Vertical split lines
    ctx.moveTo(270, 310); ctx.lineTo(270, 430);
    ctx.moveTo(440, 310); ctx.lineTo(440, 430);
    ctx.moveTo(570, 310); ctx.lineTo(570, 430);
    ctx.stroke();

    // Table Headers
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 13px "Microsoft JhengHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('架構與關卡分析', 185, 332);
    ctx.fillText('挑戰結果細節', 355, 332);
    ctx.fillText('取得學分/分數', 505, 332);
    ctx.fillText('評定等第', 635, 332);

    // Row 1: Sequence
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif';
    ctx.fillText('  第一關：循序結構', 105, 372);
    ctx.textAlign = 'center';
    ctx.font = 'normal 12px "JetBrains Mono", monospace';
    ctx.fillText('計算、型態轉換實作', 355, 372);
    ctx.fillStyle = '#0369a1';
    ctx.fillText(`${scores.sequence} 分`, 505, 372);
    
    // Row 2: Selection
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif';
    ctx.fillText('  第二關：選擇結構', 105, 396);
    ctx.textAlign = 'center';
    ctx.font = 'normal 12px "JetBrains Mono", monospace';
    ctx.fillText('if...elif...else 判斷', 355, 396);
    ctx.fillStyle = '#0369a1';
    ctx.fillText(`${scores.selection} 分`, 505, 396);
    
    // Row 3: Repetition
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif';
    ctx.fillText('  第三關：重複結構', 105, 420);
    ctx.textAlign = 'center';
    ctx.font = 'normal 12px "JetBrains Mono", monospace';
    ctx.fillText('for loops, while 迴圈', 355, 420);
    ctx.fillStyle = '#0369a1';
    ctx.fillText(`${scores.repetition} 分`, 505, 420);

    // Total final evaluations
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 16px "Microsoft JhengHei", sans-serif';
    ctx.fillText(evaluation, 635, 380);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(`${totalScore} / 195`, 635, 410);

    // Teacher descriptive comments panel (防截字: using neat multiline text wrap!)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif';
    ctx.fillText('專任教師綜合性素養評語：', 100, 460);

    ctx.fillStyle = '#334155';
    ctx.font = 'italic 12px "Microsoft JhengHei", "Apple LiGothic Medium", sans-serif';
    
    // Helper function to wrap text within target width boundary (防跑字)
    const wrapAndDrawText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split('');
      let line = '';
      let currentY = y;

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n];
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n];
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
    };

    wrapAndDrawText(remarks, 100, 482, 450, 18);

    // Stamps, Date and Signatures on Bottom Right
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('ISSUED SECURITY HASH ID: B2A9A71BFD90', 210, 532);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif';
    ctx.fillText(getFormattedDate(), 610, 475);
    ctx.fillText('資訊科技課程研究小組', 610, 500);

    // Draw realistic official stamp circle
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)'; // stamp ink red
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(610, 520, 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.font = 'bold 7px "Courier New", monospace';
    ctx.fillText('課程研討', 610, 514);
    ctx.font = 'bold 8px "Microsoft JhengHei", sans-serif';
    ctx.fillText('合格章', 610, 526);
    ctx.font = 'bold 6px "Courier New", monospace';
    ctx.fillText('PASSED', 610, 536);

  }, [profile, scores]);

  // Handle high quality PNG downloading
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Create direct anchor action
    try {
      const imageURI = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${profile.className}_${profile.seatNumber}_${profile.name}_Python成績單.png`;
      link.href = imageURI;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to export certificate image:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative select-none">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-7 shadow-2xl relative z-10 flex flex-col gap-6"
      >
        {/* Title area */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2.5 bg-amber-500/10 rounded-full text-amber-400 border border-amber-500/20 mb-2">
            <Award className="w-8 h-8" />
          </div>
          <h2 id="report-title" className="text-xl md:text-2xl font-bold font-sans tracking-tight">
            挑戰完成！生成學習證書
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            恭喜順利完成 Python 結構化程式設計限時單選大挑戰！下方為你即時產生的學力成績書複本。
          </p>
        </div>

        {/* Live visible preview element on the screen so players can read card contents instantly */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>考核日期: <strong className="text-slate-100 font-mono">{getFormattedDate()}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>認證編號: <strong className="text-slate-100 font-mono">B2-A9A71B</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">姓名 NAME</span>
              <span className="text-sm font-bold text-slate-200 mt-1 block truncate">{profile.name}</span>
            </div>
            
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">座號 SEAT NO.</span>
              <span className="text-sm font-bold text-slate-200 mt-1 block truncate">{profile.className} • {profile.seatNumber}</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">綜合等第 EVALUATION</span>
              <span className="text-sm font-bold text-amber-400 mt-1 block truncate">{evaluation.split(' • ')[1] || evaluation}</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">總分數 TOTAL</span>
              <span className="text-sm font-bold text-cyan-400 mt-1 block font-mono">{totalScore} / 195</span>
            </div>
          </div>

          {/* Teacher Comment Card */}
          <div className="bg-slate-900/40 p-3 md:p-4 rounded-lg border border-slate-800/60 text-xs">
            <span className="text-cyan-400 font-bold block mb-1">🎓 課堂素養核心評語 Remarks:</span>
            <p className="text-slate-300 italic leading-relaxed font-sans">{remarks}</p>
          </div>
        </div>

        {/* Dynamic invisible container containing the real high-res exportable canvas */}
        <div className="hidden">
          <canvas ref={canvasRef} className="border border-red-500" />
        </div>

        {/* Control and action flow panel */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="download-transcript-btn"
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
          >
            <Download className="w-5 h-5" />
            下載成績單 PNG 檔案
          </button>
          
          <button
            id="restart-main-btn"
            onClick={onReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 px-6 rounded-xl shadow transition-all active:scale-[0.98] border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer text-sm md:text-base"
          >
            <RefreshCw className="w-5 h-5" />
            再玩一次
          </button>
        </div>
      </motion.div>
    </div>
  );
}
