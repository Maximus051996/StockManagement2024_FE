import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageProductsComponent } from './damage-products.component';

describe('DamageProductsComponent', () => {
  let component: DamageProductsComponent;
  let fixture: ComponentFixture<DamageProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamageProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DamageProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
