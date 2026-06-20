import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearConvocatorias } from './modal-crear-convocatorias';

describe('ModalCrearConvocatorias', () => {
  let component: ModalCrearConvocatorias;
  let fixture: ComponentFixture<ModalCrearConvocatorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearConvocatorias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearConvocatorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
