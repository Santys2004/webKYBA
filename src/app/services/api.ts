import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private API = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCampanas(): Observable<any> {
    return this.http.get(`${this.API}/campanas`);
  }

  crearCampana(formData: FormData): Observable<any> {
    const token = localStorage.getItem('kyba_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.API}/campanas`, formData, { headers });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/auth/login`, { email, password });
  }

  registro(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/auth/registro`, { nombre, email, password });
  }

  donar(id: string, monto: number): Observable<any> {
    return this.http.post(`${this.API}/campanas/${id}/donar`, { monto });
  }

  eliminar(id: string): Observable<any> {
    const token = localStorage.getItem('kyba_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete(`${this.API}/campanas/${id}`, { headers });
  }
}