import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentChartComponent } from './segment-chart.component';

describe('SegmentChartComponent', () => {
  let component: SegmentChartComponent;
  let fixture: ComponentFixture<SegmentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
