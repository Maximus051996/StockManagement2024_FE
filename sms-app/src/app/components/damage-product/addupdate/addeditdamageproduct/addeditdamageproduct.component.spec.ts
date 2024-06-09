import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditdamageproductComponent } from './addeditdamageproduct.component';

describe('AddeditdamageproductComponent', () => {
  let component: AddeditdamageproductComponent;
  let fixture: ComponentFixture<AddeditdamageproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddeditdamageproductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddeditdamageproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
