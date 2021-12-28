import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostPetComponent } from './most-pet.component';

describe('MostPetComponent', () => {
  let component: MostPetComponent;
  let fixture: ComponentFixture<MostPetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostPetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
