import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpindexComponent } from './kpindex.component';

describe('KpindexComponent', () => {
  let component: KpindexComponent;
  let fixture: ComponentFixture<KpindexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpindexComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
