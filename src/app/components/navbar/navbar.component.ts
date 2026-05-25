import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  token: string | null = null;
  nombre: string | null = null;
  modalVisible = false;
  tabActivo = 'login';

  loginEmail = '';
  loginPassword = '';
  loginError = '';

  regNombre = '';
  regEmail = '';
  regPassword = '';
  regError = '';

  constructor(private router: Router, private api: ApiService) {}

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
    this.switchTab('login');
    this.modalVisible = true;
  }

  abrirRegistro() {
    this.switchTab('registro');
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.loginError = '';
    this.regError = '';
  }

  cerrarModalFondo(event: any) {
    if (event.target.classList.contains('modal')) this.cerrarModal();
  }

  switchTab(tab: string) {
    this.tabActivo = tab;
    this.loginError = '';
    this.regError = '';
  }

  login() {
    if (!this.loginEmail || !this.loginPassword) {
      this.loginError = 'Todos los campos son obligatorios';
      return;
    }
    this.api.login(this.loginEmail, this.loginPassword).subscribe({
      next: (data) => {
        localStorage.setItem('kyba_token', data.token);
        localStorage.setItem('kyba_nombre', data.usuario.nombre);
        this.token = data.token;
        this.nombre = data.usuario.nombre;
        this.cerrarModal();
      },
      error: () => this.loginError = 'Credenciales incorrectas'
    });
  }

  registro() {
    if (!this.regNombre || !this.regEmail || !this.regPassword) {
      this.regError = 'Todos los campos son obligatorios';
      return;
    }
    if (this.regPassword.length < 6) {
      this.regError = 'La contraseña debe tener mínimo 6 caracteres';
      return;
    }
    this.api.registro(this.regNombre, this.regEmail, this.regPassword).subscribe({
      next: (data) => {
        localStorage.setItem('kyba_token', data.token);
        localStorage.setItem('kyba_nombre', this.regNombre);
        this.token = data.token;
        this.nombre = this.regNombre;
        this.cerrarModal();
      },
      error: () => this.regError = 'Error al registrarse'
    });
  }
}