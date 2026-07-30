import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adjunciones } from './adjunciones';

describe('Adjunciones', () => {
  let component: Adjunciones;
  let fixture: ComponentFixture<Adjunciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adjunciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adjunciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
