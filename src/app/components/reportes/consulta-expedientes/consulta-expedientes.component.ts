import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consulta-expedientes',
  templateUrl: './consulta-expedientes.component.html',
  styleUrls: ['./consulta-expedientes.component.css']
})
export class ConsultaExpedientesComponent implements OnInit {
  fechaHasta: Date;
  fechaDesde: Date;

  constructor() { }

  ngOnInit(): void {
  }

}
