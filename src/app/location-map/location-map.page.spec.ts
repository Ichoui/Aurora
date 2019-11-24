import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMapPage } from './location-map.page';

describe('LocationMapPage', () => {
  let component: LocationMapPage;
  let fixture: ComponentFixture<LocationMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
