import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignpadComponent } from './signpad.component';

describe('SignpadComponent', () => {
  let component: SignpadComponent;
  let fixture: ComponentFixture<SignpadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignpadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
