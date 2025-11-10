import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { ContenidoEducativo } from '../models/ContenidoEducativo';
import { HttpClient } from '@angular/common/http';


const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Contenidoeducativoservice {

  private url = `${base_url}/educacion`;
  private listaCambio = new Subject<ContenidoEducativo[]>();

  constructor(private http: HttpClient) { }

  // Listar contenidos educativos
  list() {
    return this.http.get<ContenidoEducativo[]>(this.url)
  }

  insert(contenido: ContenidoEducativo) {
    return this.http.post(this.url, contenido)
  }

  setList(listaNueva: ContenidoEducativo[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listid(id: number) {
    return this.http.get<ContenidoEducativo>(`${this.url}/${id}`);
  }

  update(ce: ContenidoEducativo) {
    return this.http.put(`${this.url}`, ce, { responseType: `text` });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: `text` });
  }

}
