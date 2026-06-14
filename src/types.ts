export interface UserProfile {
  name: string;
  className: string;
  seatNumber: string;
}

export type StructuralType = 'sequence' | 'selection' | 'repetition';

export interface Question {
  id: number;
  type: StructuralType;
  typeLabel: string;
  code: string;
  questionText: string;
  correctAnswer: string;
  wrongAnswers: string[]; // pool of falling wrong answers
}

export interface CatchingItem {
  id: number;
  text: string;
  x: number;
  y: number;
  isCorrect: boolean;
  speed: number;
  width: number;
  height: number;
}

export interface Achievement {
  stageName: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
}
