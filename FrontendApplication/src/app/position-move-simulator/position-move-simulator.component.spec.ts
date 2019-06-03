import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionMoveSimulatorComponent } from './position-move-simulator.component';

describe('PositionMoveSimulatorComponent', () => {
  let component: PositionMoveSimulatorComponent;
  let fixture: ComponentFixture<PositionMoveSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionMoveSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionMoveSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
