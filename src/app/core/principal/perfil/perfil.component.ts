import { Component, inject } from '@angular/core';
import { SesionService } from '../../../Shared/sesion.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UrlApiService } from '../../../Shared/url-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  private http = inject(HttpClient)
  private urlApi = inject(UrlApiService)
  private sesionService = inject(SesionService)

  // Rutas
  private apiUsuario = this.urlApi.url + '/api/usuario/'

  user:any = []

  constructor(){
    this.http.get(this.apiUsuario + this.sesionService.idUser).subscribe((resp:any) =>  {this.user = resp.user, console.log(resp.user)})
  }
  

}
