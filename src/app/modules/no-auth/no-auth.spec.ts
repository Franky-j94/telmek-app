import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAuth } from './no-auth';

describe('NoAuth', () => {
  let component: NoAuth;
  let fixture: ComponentFixture<NoAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoAuth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
