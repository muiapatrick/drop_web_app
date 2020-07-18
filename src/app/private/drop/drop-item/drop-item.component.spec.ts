import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropItemComponent } from './drop-item.component';

describe('DropItemComponent', () => {
  let component: DropItemComponent;
  let fixture: ComponentFixture<DropItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
