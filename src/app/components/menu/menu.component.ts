import { Component, OnInit } from '@angular/core';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogsComponent, DialogsAlta } from '@comp/dialogs/dialogs.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    animal: string;
    name: string;

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

    constructor(private authService: AuthService, public dialog: MatDialog) { }

    ngOnInit(): void {
        // this.menus = this.authService.getMenu();
    }

    pruebas1(): void {
        const dialogRef = this.dialog.open(DialogsComponent, {
            width: '250px',
            data: 1
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.animal = result;
        });
    }

    pruebas2(): void {
        const dialogRef = this.dialog.open(DialogsAlta, {
            width: '700px'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.animal = result;
        });
    }

}