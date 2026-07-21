import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cotejos } from './cotejos';

describe('Cotejos', () => {
  let component: Cotejos;
  let fixture: ComponentFixture<Cotejos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cotejos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cotejos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
