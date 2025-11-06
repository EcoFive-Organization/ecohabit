import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Foro } from '../models/Foro';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Foroservice {
  private url =`${base_url}/foros`

  constructor(private http:HttpClient){}

  list(){
    return this.http.get<Foro[]>(this.url)
  }
}
