
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Loginservice } from '../../services/loginservice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtRequestDTO } from '../../models/jwtRequestDTO';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule, 
    FormsModule,
    MatInputModule, 
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  constructor(
    private loginService: Loginservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  username: string = "";
  password: string = "";
  mensaje: string = "";
  hidePassword = true;

  ngOnInit(): void {
      
  }

  login() {
        let request = new JwtRequestDTO();
        request.username = this.username
        request.password = this.password

        this.loginService.login(request).subscribe((data: any) => {
          sessionStorage.setItem('token', data.jwttoken)
          this.router.navigate(['menu'])
        },
        (error) => {
          this.mensaje = 'Credenciales incorrectas, intente de nuevo.'
          this.snackBar.open(this.mensaje, 'Cerrar', {duration: 3000})
        }
      )
      }

}
