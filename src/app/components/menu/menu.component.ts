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
        { nombre: 'Registro', ruta: '/main', icono: 'add' },
    ];

    registro: any[] = [
        { nombre: 'Nuevo Expediente', ruta: '/main/alta-expediente', icono: 'add' }
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