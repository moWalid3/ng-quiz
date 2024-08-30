import { computed, inject, Injectable, signal } from '@angular/core';
import { Question, QuestionRes } from '../models/quiz.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private http = inject(HttpClient);
  questions = toSignal(this.getQuestions(), {initialValue: []});
  currentQuestionIndex = signal(0);
  currentQuestion = computed(() => this.questions()[this.currentQuestionIndex()]);
  isLastQuestion = computed(() => this.currentQuestionIndex()+1 === this.questions().length)
  currentQuestionAnswers = computed(() => this.shuffleAnswers(this.currentQuestion()))
  currentAnswer = signal<string | null>(null);
  correctAnswersCount = signal(0);

  getQuestions() {
    return this.http.get<QuestionRes>('https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple').pipe(
      map(res => res.results),
      catchError( error => throwError(() => new Error('Something wrong with fetching!')))
    )
  }

  selectAnswer(selectedAnswer: string) {
    this.currentAnswer.set(selectedAnswer);
    this.correctAnswersCount.update(
      count => selectedAnswer === this.currentQuestion().correct_answer ? ++count : count
    )
  }

  moveToNextQuestion() {
    this.currentQuestionIndex.update(
      oldIndex => oldIndex+1 === this.questions().length ? oldIndex : ++oldIndex
    );
    this.currentAnswer.set(null);
  }

  restart() {
    this.currentQuestionIndex.set(0);
    this.correctAnswersCount.set(0);
    this.currentAnswer.set(null);
  }

  private shuffleAnswers(question: Question): string[] {
    const answers = [question.correct_answer, ...question.incorrect_answers];
    return answers
      .map(ans => ({sort: Math.random(), ans}))
      .sort((a, b) => a.sort - b.sort)
      .map(obj => obj.ans);
  }
}
