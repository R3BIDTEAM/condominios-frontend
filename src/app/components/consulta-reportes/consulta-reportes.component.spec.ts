import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaReportesComponent } from './consulta-reportes.component';

describe('ConsultaReportesComponent', () => {
  let component: ConsultaReportesComponent;
  let fixture: ComponentFixture<ConsultaReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
