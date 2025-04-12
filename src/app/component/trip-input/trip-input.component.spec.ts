import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripInputComponent } from './trip-input.component';

describe('TripInputComponent', () => {
  let component: TripInputComponent;
  let fixture: ComponentFixture<TripInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
