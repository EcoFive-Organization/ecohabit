import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { HttpClient } from '@angular/common/http';


const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Usuarioservice {
  private url = `${base_url}/usuarios`; // URL del UsuarioController

  private urlregister = `${base_url}/register`; // URL para el registro de usuarios

  private listaCambio = new Subject<Usuario[]>(); // para notificar cambios en la lista

  constructor(private http: HttpClient) {

  }

  // Listar usuarios
  list() {
    return this.http.get<Usuario[]>(this.url);
  }

  insert(usuario: Usuario) {
    return this.http.post(this.urlregister, usuario);
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  update(usuario: Usuario) {
    return this.http.put(`${this.url}`, usuario, {responseType: 'text'})
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'})
  }

}
