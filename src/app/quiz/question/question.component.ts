import { Component, inject } from '@angular/core';
import { QuizService } from '../../core/services/quiz.service';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {
  quizService = inject(QuizService);
}
