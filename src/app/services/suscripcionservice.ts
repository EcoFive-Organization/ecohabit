import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Suscripcion } from '../models/Suscripcion';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Suscripcionservice {
  private url = `${base_url}/suscripciones`
  private listaCambio = new Subject<Suscripcion[]>()


  constructor(private http: HttpClient) { }
  
  list() {
    return this.http.get<Suscripcion[]>(this.url)
  }

  insert(s: Suscripcion) {
    return this.http.post(this.url, s, {responseType: 'text'})
  }

  setList(listaNueva: Suscripcion[]) {
    this.listaCambio.next(listaNueva)
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}
