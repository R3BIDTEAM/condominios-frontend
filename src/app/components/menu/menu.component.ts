import { Component, OnInit } from '@angular/core';
import { AuthService } from '@serv/auth.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menus: any[] = [
    { nombre: 'Bandeja de Tareas', ruta: '/main/bandeja-tareas', icono: 'add' },
    { nombre: 'Registro', ruta: '', icono: 'add' },
    { nombre: 'Gestión', ruta: '', icono: 'add' },
    { nombre: 'Registro Procesos Masivos', ruta: '', icono: 'add' },
    { nombre: 'Reportes', ruta: '/reportes', icono: 'add' }
  ];

  reportes: any[] = [
    { nombre: 'Consulta Expedientes', ruta: '/main/consulta-expedientes', icono: 'edit' }
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // this.menus = this.authService.getMenu();
  }

}
