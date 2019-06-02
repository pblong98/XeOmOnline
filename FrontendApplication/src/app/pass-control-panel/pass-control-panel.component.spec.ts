import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassControlPanelComponent } from './pass-control-panel.component';

describe('PassControlPanelComponent', () => {
  let component: PassControlPanelComponent;
  let fixture: ComponentFixture<PassControlPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassControlPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
