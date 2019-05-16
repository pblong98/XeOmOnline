import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpSignInComponent } from './sign-up-sign-in.component';

describe('SignUpSignInComponent', () => {
  let component: SignUpSignInComponent;
  let fixture: ComponentFixture<SignUpSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
