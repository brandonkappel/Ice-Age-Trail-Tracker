import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloadWidgetComponent } from './reload-widget.component';

describe('ReloadWidgetComponent', () => {
  let component: ReloadWidgetComponent;
  let fixture: ComponentFixture<ReloadWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReloadWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReloadWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
