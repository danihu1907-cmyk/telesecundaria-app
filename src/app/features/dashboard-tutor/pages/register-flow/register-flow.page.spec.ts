import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFlowPage } from './register-flow.page';

describe('RegisterFlowPage', () => {
  let component: RegisterFlowPage;
  let fixture: ComponentFixture<RegisterFlowPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFlowPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFlowPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
