import { Component, inject } from '@angular/core';
import { UrlApiService } from '../../../Shared/url-api.service';
import { HttpClient } from '@angular/common/http';
import { SesionService } from '../../../Shared/sesion.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {

  urlApi = inject(UrlApiService)
  http = inject(HttpClient)

  password: string = ''

  // Rutas
  apiActualizarPassword = this.urlApi.url + '/api/actualizarPassword/'
  
  constructor(private sesionService:SesionService,
            private router: Router
  ){}

  actualizarPassword(){
    const form ={
      password : this.password
    }

    this.http.put(this.apiActualizarPassword + this.sesionService.idUser,form).subscribe( (data:any) =>{
      this.sesionService.actualizarPassword(data.res.email_verified_at)
      this.router.navigate(['/']).then(() => {
        window.location.href = '/';
      });
      }
    )
  }
}
