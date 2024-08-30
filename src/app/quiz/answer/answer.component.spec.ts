import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnswerComponent } from './answer.component';
import { QuizService } from '../../core/services/quiz.service';
import { Question } from '../../core/models/quiz.model';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AnswerComponent', () => {
  let component: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;
  let mockQuizService: jasmine.SpyObj<QuizService>;

  beforeEach(async () => {
    mockQuizService = jasmine.createSpyObj('QuizService', ['selectAnswer'], {
      currentAnswer: signal<string | null>(null),
      currentQuestion: signal<Question>({
        correct_answer: 'Correct Answer',
        incorrect_answers: ['Wrong Answer 1', 'Wrong Answer 2', 'Wrong Answer 3'],
      } as Question),
    });

    await TestBed.configureTestingModule({
      imports: [AnswerComponent],
      providers: [
        { provide: QuizService, useValue: mockQuizService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('answerIndex', 0)
    fixture.componentRef.setInput('ans', 'Test Answer')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectAnswer when clicked', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    hostElement.click();
    expect(mockQuizService.selectAnswer).toHaveBeenCalledWith('Test Answer');
  });

  it('should disable pointer events when an answer is selected', () => {
    mockQuizService.currentAnswer.set('Some Answer');
    fixture.detectChanges();
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList.contains('pe-none')).toBeTruthy();
  });

  it('should show correct answer', () => {
    mockQuizService.currentAnswer.set('Some Answer');
    fixture.componentRef.setInput('ans', 'Correct Answer');
    fixture.detectChanges();
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList.contains('bg-success')).toBeTruthy();
  });

  it('should show wrong answer', () => {
    mockQuizService.currentAnswer.set('Wrong Answer');
    fixture.componentRef.setInput('ans', 'Wrong Answer');
    fixture.detectChanges();
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList.contains('bg-danger')).toBeTruthy();
  });

  it('should have correct character based on answerIndex', () => {
    expect(component.character[component.answerIndex()]).toBe('A');
    fixture.componentRef.setInput( 'answerIndex', 1);
    expect(component.character[component.answerIndex()]).toBe('B');
    fixture.componentRef.setInput( 'answerIndex', 2);
    expect(component.character[component.answerIndex()]).toBe('C');
    fixture.componentRef.setInput( 'answerIndex', 3);
    expect(component.character[component.answerIndex()]).toBe('D');
  });

  it('should update isCorrectAns when answer is selected', () => {
    fixture.componentRef.setInput('ans', 'Correct Answer');
    mockQuizService.currentAnswer.set('Some Answer');
    fixture.detectChanges();
    expect(component.isCorrectAns()).toBeTruthy();
  });

  it('should update isWrongAns when wrong answer is selected', () => {
    fixture.componentRef.setInput('ans', 'Wrong Answer');
    mockQuizService.currentAnswer.set('Wrong Answer');
    fixture.detectChanges();
    expect(component.isWrongAns()).toBeTruthy();
  });

  it('should render character ans answer text', () => {
    component.quizService.currentQuestionAnswers = signal(['Some Answer'])
    const testAns = component.quizService.currentQuestionAnswers()[0];
    fixture.componentRef.setInput('ans', testAns);
    fixture.componentRef.setInput('answerIndex', 0);
    fixture.detectChanges();
    const eleHoldChar = fixture.debugElement.query(By.css('[data-testing="answer-char"]'))
    expect(eleHoldChar.nativeElement.innerText).toContain('A')
    const eleHoldAnsText = fixture.debugElement.query(By.css('[data-testing="answer-text"]'))
    expect(eleHoldAnsText.nativeElement.innerText).toContain(testAns)
  });
});
