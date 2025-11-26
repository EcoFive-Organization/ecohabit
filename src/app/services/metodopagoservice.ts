import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MetodoPago } from '../models/MetodoPago';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Metodopagoservice {
  private url = `${base_url}/metodos_pagos`;
  private listaCambio = new Subject<MetodoPago[]>()

  constructor(private http: HttpClient) { }
  
  list() {
    return this.http.get<MetodoPago[]>(this.url)
  }

  insert(m: MetodoPago) {
    return this.http.post(this.url, m, {responseType: 'text'})
  }

  setList(listaNueva: MetodoPago[]) {
    this.listaCambio.next(listaNueva)
  }

  getList() {
    return this.listaCambio.asObservable()
  }

}
