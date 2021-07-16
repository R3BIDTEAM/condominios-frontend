import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaTareasComponent } from './bandeja-tareas.component';

describe('BandejaTareasComponent', () => {
  let component: BandejaTareasComponent;
  let fixture: ComponentFixture<BandejaTareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaTareasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
