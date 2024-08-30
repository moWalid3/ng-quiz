import { TestBed } from '@angular/core/testing';

import { QuizComponent } from './quiz.component';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { Component, input, signal } from '@angular/core';
import { AnswerComponent } from './answer/answer.component';
import { Question } from '../core/models/quiz.model';
import { QuestionComponent } from './question/question.component';
import { Router } from '@angular/router';

describe('QuizComponent', () => {

  it('should contain current question / questions count', () => {
    const {fixture, component} = setup();
    const questionsLength = component.quizService.questions().length;
    expect(questionsLength).toBeGreaterThan(0);

    let headerEle = fixture.debugElement.query(By.css('[data-testing="questions-count"]')).nativeElement as HTMLElement;
    let currentQuestionCount = component.quizService.currentQuestionIndex() + 1;
    expect(headerEle.innerText).toContain(`${currentQuestionCount}/${questionsLength}`)
    component.onNextQuestion();
    fixture.detectChanges();
    currentQuestionCount = component.quizService.currentQuestionIndex() + 1;
    expect(headerEle.innerText).toContain(`${currentQuestionCount}/${questionsLength}`)
  });

  it('should render app-question component', () => {
    const {fixture, component} = setup();
    const questionComp = fixture.debugElement.query(By.directive(QuestionComponent))
    let ques = component.quizService.currentQuestion().question;
    expect(questionComp.nativeElement.innerText).toContain(ques);

    component.onNextQuestion();
    fixture.detectChanges();
    ques = component.quizService.currentQuestion().question;
    expect(questionComp.nativeElement.innerText).toContain(ques);
  });

  it('should render answers components', () => {
    const {fixture, component} = setup();
    let answersContent = component.quizService.currentQuestionAnswers();
    const answersLength = answersContent.length;
    const answersElements = fixture.debugElement.queryAll(By.directive(AnswerComponent))
    expect(answersElements.length).toBe(answersLength);
    for (let index = 0; index < answersLength; index++) {
      expect(answersElements[index].nativeElement.innerText).toContain(answersContent[index]);
    }
  });

  describe('button that rendered', () => {

    it('should toggle show-btn class', () => {
      const {fixture, component} = setup();
      const buttonEle = fixture.debugElement.query(By.css('[data-testing="next-button"]'));
      expect(buttonEle).not.toBeNull()

      expect((buttonEle.nativeElement as HTMLElement).classList).not.toContain('show-btn');
      component.quizService.currentAnswer.set('answer1');
      fixture.detectChanges();
      expect((buttonEle.nativeElement as HTMLElement).classList).toContain('show-btn');
    })

    it('should trigger onNextQuestion func', () => {
      const {fixture, component} = setup();
      const buttonEle = fixture.debugElement.query(By.css('[data-testing="next-button"]'));
      expect(component.quizService.isLastQuestion()).toBeFalse();
      buttonEle.triggerEventHandler('click');
      expect(component.quizService.isLastQuestion()).toBeTrue();
    })

    it('should trigger onNextQuestion func', () => {
      const {fixture, component, router} = setup();
      component.quizService.moveToNextQuestion();
      fixture.detectChanges();
      const navigateSpy = spyOn(router, 'navigate');
      component.onNextQuestion();
      expect(navigateSpy).toHaveBeenCalledWith(['/score'])
    })

    it('should change inner text if reach at last qes', () => {
      const {fixture, component} = setup();
      const buttonEle = fixture.debugElement.query(By.css('[data-testing="next-button"]'));
      expect(buttonEle.nativeElement.textContent).toContain('Next Question');
      component.onNextQuestion();
      fixture.detectChanges();
      expect(buttonEle.nativeElement.textContent).toContain('Show Score');
    })


  });

  it('should create', () => {
    const {component} = setup();
    expect(component).toBeTruthy();
  });
});

function setup() {
  @Component({
    selector: 'app-answer',
    standalone: true,
    template: `
      <span>{{ character[answerIndex()] }}</span>
      <p>{{ ans() }}</p>
    `,
    providers: [
      {
        provide: AnswerComponent,
        useExisting: AnswerComponentStub //- alias to use it like an original one
      }
    ]
  })
  class AnswerComponentStub implements Partial<AnswerComponent> {
    ans = input.required<string>();
    answerIndex = input.required<number>();
  }

  TestBed.overrideComponent(AnswerComponent, {
    remove: { imports: [AnswerComponent] },
    add: { imports: [AnswerComponentStub] }
  });

  TestBed.configureTestingModule({
    providers: [provideHttpClient()]
  })

  const fixture = TestBed.createComponent(QuizComponent);
  fixture.componentInstance.quizService.questions = signal([
    { question: 'Q1', correct_answer: 'A1', incorrect_answers: ['B1', 'C1', 'D1'] },
    { question: 'Q2', correct_answer: 'A2', incorrect_answers: ['B2', 'C2', 'D2'] }
  ] as Question[])

  const component = fixture.componentInstance;
  let router = TestBed.inject(Router);

  fixture.detectChanges();

  return {fixture, component, router}
}