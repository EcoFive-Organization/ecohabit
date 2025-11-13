import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Billetera } from '../models/Billetera';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url=environment.base

@Injectable({
  providedIn: 'root',
})
export class Billeteraservice {
  private url = `${base_url}/billeteras`;
  private listaCambio = new Subject<Billetera[]>();
  
  constructor(private http:HttpClient){}
  list() {
    return this.http.get<Billetera[]>(this.url);
  }

  insert(b: Billetera) {
    return this.http.post(this.url, b, { responseType: 'text' });
  }

  setList(listaNueva: Billetera[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}
