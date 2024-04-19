import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsDashboardComponent } from './ins-dashboard.component';

describe('InsDashboardComponent', () => {
  let component: InsDashboardComponent;
  let fixture: ComponentFixture<InsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
