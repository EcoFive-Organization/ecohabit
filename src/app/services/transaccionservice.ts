import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Transaccion } from '../models/Transaccion';
import { HttpClient } from '@angular/common/http';
import { CantidadTransaccionesDTO } from '../models/CantidadtRansaccionesDTO';
import { MontoTransaccionesDTO } from '../models/MontoTransaccionesDTO';

const base_url=environment.base

@Injectable({
  providedIn: 'root',
})
export class Transaccionservice {
  private url = `${base_url}/transacciones`;
  private listaCambio = new Subject<Transaccion[]>();
  
  constructor(private http:HttpClient){}

  list() {
    return this.http.get<Transaccion[]>(this.url);
  }

  insert(t: Transaccion) {
    return this.http.post(this.url, t, { responseType: 'text' });
  }

  setList(listaNueva: Transaccion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
  
  listId(id: number) {
    return this.http.get<Transaccion>(`${this.url}/${id}`);
  }
  update(t: Transaccion) {
    return this.http.put(`${this.url}`, t, { responseType: 'text' });
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  // 🟢 REPORTE 1: Detalles completos (Ideal para Tabla + Gráfico de Barras)
  getDetallesTransaccionesPorTipo() {
    return this.http.get<CantidadTransaccionesDTO[]>(`${this.url}/DetallesTransaccionesPorTipo`);
  }

  // 🟢 REPORTE 2: Solo Montos (Ideal para Pie Chart)
  // OJO: Respeté el nombre del endpoint tal cual está en tu backend "/MontoTransaciones"
  getMontoTransacciones() {
    return this.http.get<MontoTransaccionesDTO[]>(`${this.url}/MontoTransaciones`);
  }
}
