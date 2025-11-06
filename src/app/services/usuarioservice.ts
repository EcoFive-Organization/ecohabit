import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/Usuario';
import { HttpClient } from '@angular/common/http';


const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Usuarioservice {
  private url = `${base_url}/usuarios`;

  constructor(private http: HttpClient) {

  }

  // Listar usuarios
  list() {
    return this.http.get<Usuario[]>(this.url);
  }


}
