import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Dispositivo } from '../models/Dispositivo';
import { HttpClient } from '@angular/common/http';


const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Dispositivoservice {
  private url = `${base_url}/dispositivos`;

  private listaCambio = new Subject<Dispositivo[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Dispositivo[]>(this.url);
  }

  insert(d: Dispositivo) {
    return this.http.post(this.url, d, {responseType: 'text'});
  }

  setList(listaNueva: Dispositivo[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Dispositivo>(`${this.url}/${id}`);
  }

  update(d: Dispositivo) {
    return this.http.put(`${this.url}`, d, {responseType: 'text'});
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }

}
