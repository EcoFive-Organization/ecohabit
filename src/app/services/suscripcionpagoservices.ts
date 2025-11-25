import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Suscripcionpago } from '../models/SuscripcionPago';
import { HttpClient } from '@angular/common/http';

const base_url=environment.base
@Injectable({
  providedIn: 'root',
})
export class Suscripcionpagoservices {
  private url = `${base_url}/suscripciones_pagos`;
  private listaCambio = new Subject<Suscripcionpago[]>();
  constructor (private http:HttpClient){}
  list(){
    return this.http.get<Suscripcionpago[]>(this.url);
  }
  insert(sp: Suscripcionpago) {
    return this.http.post(this.url, sp, { responseType: 'text' });
  }

  setList(listaNueva: Suscripcionpago[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}
