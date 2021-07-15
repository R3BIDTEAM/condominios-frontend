import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaExpedientesComponent } from './consulta-expedientes.component';

describe('ConsultaExpedientesComponent', () => {
  let component: ConsultaExpedientesComponent;
  let fixture: ComponentFixture<ConsultaExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaExpedientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
