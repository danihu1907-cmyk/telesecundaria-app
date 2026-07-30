import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTutores } from './tabla-tutores';

describe('TablaTutores', () => {
  let component: TablaTutores;
  let fixture: ComponentFixture<TablaTutores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaTutores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaTutores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
