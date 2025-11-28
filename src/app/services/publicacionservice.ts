import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CantidadReaccionesPublicacionDTO } from '../models/CantidadReaccionesPublicacionDTO';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Publicacionservice {
  private url = `${base_url}/publicaciones`;

  constructor(private http: HttpClient) {}

  // Reporte Cantidad de Reacciones por Publicación
  // En tu PublicacionService
  getQuantity(idUsuario: number) {
    // Concatenamos el ID a la URL
    return this.http.get<any[]>(`${this.url}/cantidadReacciones/${idUsuario}`);
  }
}
