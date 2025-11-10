import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Recompensa } from '../models/Recompensa';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Recompensaservice {
  private url =`${base_url}/recompensas`;
  private listaCambio = new Subject<Recompensa[]>();

  constructor(private http: HttpClient){}
  
  //listar recompensas
  list(){
    return this.http.get<Recompensa[]>(this.url)
  }

  insert(recompensa: Recompensa){
    return this.http.post(this.url, recompensa);
  }

  setList(listaNueva: Recompensa[]){
    this.listaCambio.next(listaNueva);
  }

  getList(){
    return this.listaCambio.asObservable();
  }

  listid(id: number) {
    return this.http.get<Recompensa>(`${this.url}/${id}`);
  }

  update(r: Recompensa) {
    return this.http.put(`${this.url}`, r, { responseType: `text` });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: `text` });
  }
}
