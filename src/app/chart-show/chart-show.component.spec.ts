import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartShowComponent } from './chart-show.component';

describe('ChartShowComponent', () => {
  let component: ChartShowComponent;
  let fixture: ComponentFixture<ChartShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
