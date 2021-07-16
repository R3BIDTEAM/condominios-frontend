import { Component, OnInit } from '@angular/core';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    menus: any[] = [
        { nombre: 'Dashboard', ruta: '/dashboard', icono: 'dashboard' },
    ];

    constructor(private authService: AuthService, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.menus = this.authService.getMenu();
    }
}