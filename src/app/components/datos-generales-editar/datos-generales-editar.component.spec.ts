import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesEditarComponent } from './datos-generales-editar.component';

describe('DatosGeneralesEditarComponent', () => {
  let component: DatosGeneralesEditarComponent;
  let fixture: ComponentFixture<DatosGeneralesEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosGeneralesEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
