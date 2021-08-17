import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaCuentaPredialComponent } from './busqueda-cuenta-predial.component';

describe('BusquedaCuentaPredialComponent', () => {
  let component: BusquedaCuentaPredialComponent;
  let fixture: ComponentFixture<BusquedaCuentaPredialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaCuentaPredialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaCuentaPredialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
