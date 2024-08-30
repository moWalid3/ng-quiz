import { Component, inject } from '@angular/core';
import { QuizService } from '../core/services/quiz.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss',
})
export class ScoreComponent {
  quizService = inject(QuizService);
}
