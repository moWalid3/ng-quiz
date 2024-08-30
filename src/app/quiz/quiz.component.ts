import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { QuizService } from '../core/services/quiz.service';
import { QuestionComponent } from "./question/question.component";
import { AnswerComponent } from "./answer/answer.component";
import { Router } from '@angular/router';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [QuestionComponent, AnswerComponent, NgStyle],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizComponent implements OnInit{
  private router = inject(Router);
  quizService = inject(QuizService);

  onNextQuestion() {
    if(this.quizService.isLastQuestion()) {
      this.router.navigate(['/score']);
    } else {

      this.quizService.moveToNextQuestion();
    }
  }

  ngOnInit(): void {
    this.quizService.restart();
  }
}
