import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercCalcuComponent } from './perc-calcu.component';

describe('PercCalcuComponent', () => {
  let component: PercCalcuComponent;
  let fixture: ComponentFixture<PercCalcuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PercCalcuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PercCalcuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
