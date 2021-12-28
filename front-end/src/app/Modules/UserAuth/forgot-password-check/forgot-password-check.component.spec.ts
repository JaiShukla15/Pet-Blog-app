import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordCheckComponent } from './forgot-password-check.component';

describe('ForgotPasswordCheckComponent', () => {
  let component: ForgotPasswordCheckComponent;
  let fixture: ComponentFixture<ForgotPasswordCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
