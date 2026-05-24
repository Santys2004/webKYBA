import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-campanas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campanas.component.html',
  styleUrl: './campanas.component.css'
})
export class CampanasComponent implements OnInit {

  campanas: any[] = [];
  cargando = true;
  modalAbierto = false;
  donarAbierto: string | null = null;
  montoDonacion: number = 0;
  previewUrl: string | null = null;
  imagenArchivo: File | null = null;

  form = {
    nombre: '',
    descripcion: '',
    meta: null
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarCampanas();
  }

  cargarCampanas() {
    this.cargando = true;
    this.api.getCampanas().subscribe({
      next: (data) => {
        this.campanas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  getPct(c: any): number {
    return Math.min(100, Math.round((c.monto_recaudado / c.meta) * 100));
  }

  abrirModal() {
    const token = localStorage.getItem('kyba_token');
    if (!token) {
      alert('Debes iniciar sesión para crear una campaña');
      return;
    }
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.previewUrl = null;
    this.imagenArchivo = null;
    this.form = { nombre: '', descripcion: '', meta: null };
  }

  cerrarModalFondo(event: any) {
    if (event.target.classList.contains('modal')) this.cerrarModal();
  }

  previewImagen(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;
    this.imagenArchivo = archivo;
    const reader = new FileReader();
    reader.onload = (e: any) => this.previewUrl = e.target.result;
    reader.readAsDataURL(archivo);
  }

  guardarCampana() {
    if (!this.form.nombre || !this.form.descripcion || !this.form.meta) {
      alert('Por favor completa todos los campos');
      return;
    }
    const formData = new FormData();
    formData.append('titulo', this.form.nombre);
    formData.append('descripcion', this.form.descripcion);
    formData.append('meta', String(this.form.meta));
    if (this.imagenArchivo) formData.append('imagen', this.imagenArchivo);

    this.api.crearCampana(formData).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarCampanas();
      },
      error: () => alert('Error al crear campaña')
    });
  }

  toggleDonar(id: string) {
    this.donarAbierto = this.donarAbierto === id ? null : id;
    this.montoDonacion = 0;
  }

  donar(id: string) {
    if (!this.montoDonacion || this.montoDonacion <= 0) {
      alert('Ingresa un monto válido');
      return;
    }
    this.api.donar(id, this.montoDonacion).subscribe({
      next: () => {
        this.toggleDonar(id);
        this.cargarCampanas();
      },
      error: () => alert('Error al donar')
    });
  }

  eliminar(id: string) {
    if (!confirm('¿Seguro que quieres eliminar esta campaña?')) return;
    this.api.eliminar(id).subscribe({
      next: () => this.cargarCampanas(),
      error: () => alert('Error al eliminar')
    });
  }
}