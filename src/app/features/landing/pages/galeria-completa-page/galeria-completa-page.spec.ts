import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaCompletaPage } from './galeria-completa-page';

describe('GaleriaCompletaPage', () => {
  let component: GaleriaCompletaPage;
  let fixture: ComponentFixture<GaleriaCompletaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaCompletaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaCompletaPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
