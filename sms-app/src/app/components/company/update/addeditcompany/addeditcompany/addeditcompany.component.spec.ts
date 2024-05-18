import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditcompanyComponent } from './addeditcompany.component';

describe('AddeditcompanyComponent', () => {
  let component: AddeditcompanyComponent;
  let fixture: ComponentFixture<AddeditcompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddeditcompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddeditcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
