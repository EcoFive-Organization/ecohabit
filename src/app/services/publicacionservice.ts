import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CantidadReaccionesPublicacionDTO } from '../models/CantidadReaccionesPublicacionDTO';
import { Publicacion } from '../models/Publicacion';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Publicacionservice {
  private url = `${base_url}/publicaciones`;
  private listaCambio = new Subject<Publicacion[]>()

  constructor(private http: HttpClient) { }
  
  list() {
    return this.http.get<Publicacion[]>(this.url)
  }

  insert(p: Publicacion) {
    return this.http.post(this.url, p, {responseType: 'text'})
  }

  setList(listaNueva: Publicacion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Publicacion>(`${this.url}/${id}`)
  }

  update(p: Publicacion) {
    return this.http.put(`${this.url}`, p, {responseType: 'text'})
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'})
  }



  // Reporte Cantidad de Reacciones por Publicación
  // En tu PublicacionService
  getQuantity(idUsuario: number) {
    // Concatenamos el ID a la URL
    return this.http.get<any[]>(`${this.url}/cantidadReacciones/${idUsuario}`);
  }
}
