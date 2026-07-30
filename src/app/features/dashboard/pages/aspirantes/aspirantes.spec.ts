import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aspirantes } from './aspirantes';

describe('Aspirantes', () => {
  let component: Aspirantes;
  let fixture: ComponentFixture<Aspirantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aspirantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aspirantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
