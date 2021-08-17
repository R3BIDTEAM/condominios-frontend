import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaReportesNoComponent } from './consulta-reportes-no.component';

describe('ConsultaReportesNoComponent', () => {
  let component: ConsultaReportesNoComponent;
  let fixture: ComponentFixture<ConsultaReportesNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaReportesNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaReportesNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
