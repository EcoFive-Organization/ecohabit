import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Foro } from '../models/Foro';
import { Subject } from 'rxjs';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Foroservice {
  private url =`${base_url}/foros`;
  private listaCambio = new Subject<Foro[]>();

  constructor(private http:HttpClient){}
  
  //listar foros
  list(){
    return this.http.get<Foro[]>(this.url)
  }

  insert(foro: Foro){
    return this.http.post(this.url, foro);
  }

  setList(listaNueva: Foro[]){
    this.listaCambio.next(listaNueva);
  }

  getList(){
    return this.listaCambio.asObservable();
  }

  listid(id: number) {
    return this.http.get<Foro>(`${this.url}/${id}`);
  }

  update(f: Foro) {
    return this.http.put(`${this.url}`, f, { responseType: `text` });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: `text` });
  }
}
