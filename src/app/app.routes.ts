import { Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';

export const routes: Routes = [
  {
    path: '',
    component: QuizComponent,
  },
  {
    path: 'score',
    loadComponent: () =>
      import('./score/score.component').then((com) => com.ScoreComponent),
  },
];
