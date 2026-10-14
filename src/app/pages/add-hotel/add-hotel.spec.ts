import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHotel } from './add-hotel';

describe('AddHotel', () => {
  let component: AddHotel;
  let fixture: ComponentFixture<AddHotel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHotel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHotel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
