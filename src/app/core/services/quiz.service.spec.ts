import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { QuizService } from './quiz.service';
import { Question } from '../models/quiz.model';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

describe('QuizService', () => {

  it('should fetch data by getQuestions func', () => {
    const { service, mockQues, httpMoke } = setup();

    expect(service.questions()).toEqual([]);
    expect(service.isLastQuestion()).toEqual(false);

    service.questions();
    // expect(service.questions()[0].question).toEqual(mockQues.question);
    // service.getQuestions().subscribe();

    const req = httpMoke.expectOne(
      `https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple`
    );

    expect(req.request.method).toBe('GET');

    req.flush({
      response_code: 0,
      results: [mockQues]
    });
    httpMoke.verify();
  });

  it('should handle errors when fetching questions', fakeAsync(() => {
  const { service, mockQues, httpMoke } = setup();

  service.questions();

  tick();

  const requests = httpMoke.match(
    'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'
  );
  expect(requests.length).toBe(1);
  requests.forEach(req => {
    req.error(new ErrorEvent('Network error', {
      message: 'Failed to fetch'
    }));
  });

  tick();

  expect(service.questions).toThrowError(/Something/);
  }));

  it('should set currentQuestionIndex to 0 by default', () => {
    const { service } = setup();
    expect(service.currentQuestionIndex()).toBe(0);
  });

  it('should set currentAnswer to null by default', () => {
    const { service } = setup();
    expect(service.currentAnswer()).toBeNull();
    service.currentAnswer.set('answer1');
    expect(service.currentAnswer()).toBe('answer1');
  });

  it('should set correctAnswerCount to 0 by default', () => {
    const { service } = setup();
    expect(service.correctAnswersCount()).toBe(0);
    service.correctAnswersCount.update((c) => ++c);
    expect(service.correctAnswersCount()).toBe(1);
  });

  it('should set currentQuestion to be mockQuestion by default', () => {
    const { service, mockQues } = setup();
    expect(service.currentQuestion()).toBeUndefined();
    service.getQuestions().subscribe((res) => {
      expect(service.currentQuestion()).toEqual(mockQues);
    });
  });

  it('should handle selectAnswer function', () => {
    const { service, mockQues } = setup();
    service.questions = signal([mockQues, mockQues])
    let ans = '25';
    service.selectAnswer(ans);
    expect(service.currentAnswer()).toBe(ans);
    expect(service.correctAnswersCount()).toBe(1);
    ans = '25';
    service.selectAnswer(ans);
    expect(service.currentAnswer()).toBe(ans);
    expect(service.correctAnswersCount()).toBe(2);
  });

  it('should handle moveToNextQuestion function', () => {
    const { service, mockQues } = setup();
    service.questions = signal([mockQues])
    let ans = 'answer1';
    service.selectAnswer(ans);
    expect(service.currentAnswer()).toBe(ans);
    expect(service.currentQuestionIndex()).toBe(0);
    service.moveToNextQuestion();
    expect(service.currentAnswer()).toBeNull();
    expect(service.currentQuestionIndex()).toBe(0);

  });

  it('should handle restart function', () => {
    const { service, mockQues } = setup();
    service.questions = signal([mockQues]);

    let correctAns = '25';
    service.selectAnswer(correctAns);
    expect(service.currentAnswer()).toBe(correctAns);
    expect(service.correctAnswersCount()).toBe(1);
    expect(service.currentQuestionIndex()).toBe(0);
    service.restart();
    expect(service.currentAnswer()).toBeNull();
    expect(service.correctAnswersCount()).toBe(0);
    expect(service.currentQuestionIndex()).toBe(0);
  });

  it('should shuffle answers', () => {
    const { service, mockQues } = setup();

    const shuffledAnswers = service['shuffleAnswers'](mockQues);
    expect(shuffledAnswers.length).toBe(4);
    expect(shuffledAnswers).toContain('25');
    expect(shuffledAnswers).toContain('19');
    expect(shuffledAnswers).toContain('69');
    expect(shuffledAnswers).toContain('41');

    const multipleShuffles = Array(10)
      .fill(null)
      .map(() => service['shuffleAnswers'](mockQues));
    const allSame = multipleShuffles.every(
      (shuffle) =>
        JSON.stringify(shuffle) === JSON.stringify(multipleShuffles[0])
    );
    expect(allSame).toBeFalse();
  });

  it('should identify last question correctly', () => {
    const { service, mockQues } = setup();
    service.questions = signal([mockQues, mockQues]);

    expect(service.isLastQuestion()).toBeFalse();
    service.currentQuestionIndex.set(1);
    expect(service.isLastQuestion()).toBeTrue();
  });

  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });
});

/*
  => the key is --> [fetch + fetchError] ==> work with httpMoke and fake response...
  todo=> any testing function or property ==> set a fake - mock data and work with it without make subscript
  todo=> (here and in all components inject this service -> set a fake question [data])
*/

function setup() {
  const mockQues: Question = {
    type: 'multiple',
    difficulty: 'easy',
    category: 'Sports',
    question: 'How many points did LeBron James score in his first NBA game?',
    correct_answer: '25',
    incorrect_answers: ['19', '69', '41'],
  };

  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  const service = TestBed.inject(QuizService);
  const httpMoke = TestBed.inject(HttpTestingController);

  return { mockQues, service, httpMoke };
}


