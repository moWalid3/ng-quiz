import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionComponent } from './question.component';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { Question } from '../../core/models/quiz.model';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    component.quizService.questions = signal([
      { question: 'Q1', correct_answer: 'A1', incorrect_answers: ['B1', 'C1', 'D1'] },
    ] as Question[])
    fixture.detectChanges();
  });

  it('Should render question', () => {
    fixture.detectChanges();
    const ques = component.quizService.currentQuestion().question;
    expect(fixture.nativeElement.innerText).toContain(ques);
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
