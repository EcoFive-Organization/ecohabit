import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtRequestDTO } from '../models/jwtRequestDTO';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class Loginservice {

  constructor(private http: HttpClient) {}

  login(request: JwtRequestDTO) {
    return this.http.post('http://localhost:8080/login', request)
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

  // *** MÉTODO AÑADIDO: NECESARIO PARA EL DASHBOARD ***
  // Devuelve el objeto payload del token
  decodeToken(token: string): any {
    const helper = new JwtHelperService();
    // Asume que el payload tiene una propiedad 'id' o 'sub' con el ID del usuario
    return helper.decodeToken(token);
  }

}
