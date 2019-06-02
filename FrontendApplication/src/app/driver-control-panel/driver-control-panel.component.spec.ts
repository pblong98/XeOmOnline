import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverControlPanelComponent } from './driver-control-panel.component';

describe('DriverControlPanelComponent', () => {
  let component: DriverControlPanelComponent;
  let fixture: ComponentFixture<DriverControlPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverControlPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
