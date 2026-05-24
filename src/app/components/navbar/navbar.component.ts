import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  token: string | null = null;
  nombre: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.token = localStorage.getItem('kyba_token');
    this.nombre = localStorage.getItem('kyba_nombre');
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }

  cerrarSesion() {
    localStorage.removeItem('kyba_token');
    localStorage.removeItem('kyba_nombre');
    this.token = null;
    this.nombre = null;
    this.router.navigate(['']);
  }

  abrirLogin() {
    // próximamente modal de login
  }

  abrirRegistro() {
    // próximamente modal de registro
  }
}