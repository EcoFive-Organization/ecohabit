import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PlanSuscripcion } from '../models/PlanSuscripcion';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Plansuscripcionservice {
  private url=`${base_url}/plan-suscripcion`

  constructor(private http:HttpClient){
  }
  
  list(){
    return this.http.get<PlanSuscripcion[]>(this.url)
  }
}
