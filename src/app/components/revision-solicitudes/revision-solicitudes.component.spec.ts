import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionSolicitudesComponent } from './revision-solicitudes.component';

describe('RevisionSolicitudesComponent', () => {
  let component: RevisionSolicitudesComponent;
  let fixture: ComponentFixture<RevisionSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionSolicitudesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
