import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditproductComponent } from './addeditproduct.component';

describe('AddeditproductComponent', () => {
  let component: AddeditproductComponent;
  let fixture: ComponentFixture<AddeditproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddeditproductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddeditproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
