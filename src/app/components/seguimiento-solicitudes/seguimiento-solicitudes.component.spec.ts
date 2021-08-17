import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoSolicitudesComponent } from './seguimiento-solicitudes.component';

describe('SeguimientoSolicitudesComponent', () => {
  let component: SeguimientoSolicitudesComponent;
  let fixture: ComponentFixture<SeguimientoSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoSolicitudesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
