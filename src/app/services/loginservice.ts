import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtRequestDTO } from '../models/jwtRequestDTO';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Loginservice {
  private url = `${base_url}/login`;
  constructor(private http: HttpClient) {}

  login(request: JwtRequestDTO) {
    return this.http.post(this.url, request);
  }

  verificar() {
    let token = sessionStorage.getItem('token');
    return token != null;
  }

  showRole() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.role;
  }
}
