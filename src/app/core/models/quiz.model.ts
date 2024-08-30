export interface Question {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export type AnswerChar = 'A' | 'B' | 'C' | 'D';

export interface QuestionRes {
	response_code: number;
	results: Question[];
}