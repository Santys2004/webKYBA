import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-campanas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campanas.component.html',
  styleUrl: './campanas.component.css',
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
    meta: null as number | null,
  };

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarCampanas();
  }

  cargarCampanas() {
    this.cargando = true;
    this.api.getCampanas().subscribe({
      next: (data) => {
        this.campanas = data;
        this.cargando = false;
        this.cd.detectChanges(); // ← nuevo
      },
      error: () => {
        this.cargando = false;
        this.cd.detectChanges(); // ← nuevo
      },
    });
  }

  getPct(c: any): number {
    return Math.min(100, Math.round((c.monto_recaudado / c.meta) * 100));
  }

  // — Abrir modal solo si hay sesión, si no abre el modal de login
  abrirModal() {
    const token = localStorage.getItem('kyba_token');
    if (!token) {
      window.dispatchEvent(new CustomEvent('abrirLogin'));
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
    reader.onload = (e: any) => (this.previewUrl = e.target.result);
    reader.readAsDataURL(archivo);
  }

  guardarCampana() {
    if (!this.form.nombre || !this.form.descripcion || !this.form.meta) {
      alert('Por favor completa todos los campos');
      return;
    }
    // Validación meta mínima
    if (this.form.meta < 100) {
      alert('La meta mínima es $100');
      return;
    }
    // Validación descripción máxima
    if (this.form.descripcion.length > 150) {
      alert('La descripción no puede superar 150 caracteres');
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
      error: () => alert('Error al crear campaña'),
    });
  }

  // — Donar solo si hay sesión
  toggleDonar(id: string) {
    const token = localStorage.getItem('kyba_token');
    if (!token) {
      window.dispatchEvent(new CustomEvent('abrirLogin'));
      return;
    }
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
        this.donarAbierto = null;
        this.cargarCampanas();
      },
      error: () => alert('Error al donar'),
    });
  }

  eliminar(id: string) {
    if (!confirm('¿Seguro que quieres eliminar esta campaña?')) return;
    this.api.eliminar(id).subscribe({
      next: () => this.cargarCampanas(),
      error: () => alert('No tienes permiso para eliminar esta campaña'),
    });
  }
}
