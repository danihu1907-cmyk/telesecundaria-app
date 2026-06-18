import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspiranteCardComponent } from './aspirante-card.component';

describe('AspiranteCardComponent', () => {
  let component: AspiranteCardComponent;
  let fixture: ComponentFixture<AspiranteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspiranteCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspiranteCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
