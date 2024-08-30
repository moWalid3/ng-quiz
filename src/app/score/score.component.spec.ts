import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreComponent } from './score.component';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

describe('ScoreComponent', () => {
  let fixture: ComponentFixture<ScoreComponent>;
  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ScoreComponent],
        providers: [provideHttpClient(), provideRouter([])]
      })
      .compileComponents();

    fixture = TestBed.createComponent(ScoreComponent);
    fixture.detectChanges();
  });

  it('should final-score record is render in HTML', () => {
    fixture.componentInstance.quizService.correctAnswersCount.set(3);
    fixture.detectChanges();
    const eleHoldScore = fixture.debugElement.query(By.css('[data-testing="record"]'));
    expect(eleHoldScore.nativeElement.innerText).toContain('3')
  });

  it('should have a link to return home', () => {
    const btnEle = fixture.debugElement.query(By.css('[data-testing="score-play-again"]'));
    expect((btnEle.nativeElement as HTMLElement).getAttribute('routerLink')).not.toBeNull();
    expect((btnEle.nativeElement as HTMLElement).getAttribute('routerLink')).toContain('/');
  });


  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
