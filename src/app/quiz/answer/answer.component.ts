import { Component, computed, inject, input } from '@angular/core';
import { AnswerChar } from '../../core/models/quiz.model';
import { QuizService } from '../../core/services/quiz.service';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.scss',
  host: {
    '(click)': 'quizService.selectAnswer(ans())',
    '[class.pe-none]': 'quizService.currentAnswer()',
    '[class.bg-success]': 'isCorrectAns()',
    '[class.bg-danger]': 'isWrongAns()',
  },
})
export class AnswerComponent {
  quizService = inject(QuizService);
  answerIndex = input.required<number>();
  ans = input.required<string>();

  isCorrectAns = computed(
    () =>
      !!this.quizService.currentAnswer() &&
      this.quizService.currentQuestion().correct_answer === this.ans()
  );

  isWrongAns = computed(
    () =>
      this.ans() === this.quizService.currentAnswer() &&
      this.quizService.currentQuestion().correct_answer !==
        this.quizService.currentAnswer()
  );

  character: AnswerChar[] = ['A', 'B', 'C', 'D'];
}
