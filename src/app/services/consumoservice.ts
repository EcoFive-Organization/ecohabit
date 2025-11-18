import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Consumo } from '../models/Consumo';
import { HttpClient } from '@angular/common/http';


const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Consumoservice {
  private url = `${base_url}/consumos`;
  private listaCambio = new Subject<Consumo[]>();


  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Consumo[]>(this.url);
  }

  insert(c: Consumo) {
    return this.http.post(this.url, c, {responseType: 'text'});
  }

  setList(listaNueva: Consumo[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

}
