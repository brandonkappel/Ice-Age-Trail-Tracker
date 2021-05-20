import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalMilesChartComponent } from './total-miles-chart.component';

describe('TotalMilesChartComponent', () => {
  let component: TotalMilesChartComponent;
  let fixture: ComponentFixture<TotalMilesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalMilesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalMilesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
