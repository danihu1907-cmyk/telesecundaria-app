import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFormComponent } from './info-form.component';

describe('InfoFormComponent', () => {
  let component: InfoFormComponent;
  let fixture: ComponentFixture<InfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
