import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Consumo } from '../models/Consumo';
import { HttpClient } from '@angular/common/http';
import { CantidadConsumoDTO } from '../models/CantidadConsumoDTO';
import { CantConsumoDispDTO } from '../models/CantConsumoDispDTO';

const base_url = environment.base;
export interface ConsumoGraficoDTO {
  fecha: string;
  tipo: string;
  total: number;
}
@Injectable({
  providedIn: 'root',
})
export class Consumoservice {
  private url = `${base_url}/consumos`;
  private listaCambio = new Subject<Consumo[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Consumo[]>(this.url);
  }

  insert(c: Consumo) {
    return this.http.post(this.url, c, { responseType: 'text' });
  }

  setList(listaNueva: Consumo[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  // 🟢 NUEVO MÉTODO: Obtiene los datos agrupados por día para el gráfico
  getGraficoSemanal(weeksAgo: number = 0) {
    return this.http.get<ConsumoGraficoDTO[]>(`${this.url}/grafico-semanal?weeksAgo=${weeksAgo}`);
  }

  // 🟢 NUEVO MÉTODO PARA EL REPORTE
  getCantidadPorTipoConsumo() {
    return this.http.get<CantidadConsumoDTO[]>(`${this.url}/CantidadPorTipoConsumo`);
  }

  // 🟢 NUEVO MÉTODO PARA EL REPORTE DE DISPOSITIVOS
  getConsumoTotalPorDispositivo() {
    return this.http.get<CantConsumoDispDTO[]>(`${this.url}/ConsumoTotalPorDispositivo`);
  }
}
