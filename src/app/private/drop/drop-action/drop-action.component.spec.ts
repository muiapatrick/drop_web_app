import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropActionComponent } from './drop-action.component';

describe('DropActionComponent', () => {
  let component: DropActionComponent;
  let fixture: ComponentFixture<DropActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
