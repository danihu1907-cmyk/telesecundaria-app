import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Revisiones } from './revisiones';

describe('Revisiones', () => {
  let component: Revisiones;
  let fixture: ComponentFixture<Revisiones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Revisiones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Revisiones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
