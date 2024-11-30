import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SesionService } from '../../Shared/sesion.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlApiService } from '../../Shared/url-api.service';

import * as cryptoJS from 'crypto-js';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {


  @ViewChild('inputCorreoElectronico') emailInput!: ElementRef;

  private http = inject(HttpClient)
  private urlApi = inject(UrlApiService)

  mostrarModal:boolean = false

  email: string = '';
  password: string = '';

  numeroString: string = ''

  datosIncorrectos:boolean = false;

   // Rutas
  private apiInicioSesion = this.urlApi.url + '/api/login'

  constructor(private router:Router,
              private sesionService:SesionService
              ){}

  abrirModalInicioSesion(){
    this.mostrarModal = true
    setTimeout(() => {
      this.emailInput.nativeElement.focus()
    },1)
  }

  cerrarModalInicioSesion() {
    this.mostrarModal = false;
  }


  // Inicio sesion funciones

  public login(form: any): Observable<any> {
    var JsonFormatter = {
      stringify: function (cipherParams: any) {
        var jsonObj = { t: cipherParams.ciphertext.toString(cryptoJS.enc.Base64), i: null, s: null };
        if (cipherParams.iv) {
          jsonObj.i = cipherParams.iv.toString();
        }
        if (cipherParams.salt) {
          jsonObj.s = cipherParams.salt.toString();
        }
        return JSON.stringify(jsonObj);
      },
      parse: function (jsonStr: string) {
        var jsonObj = JSON.parse(jsonStr);
        var cipherParams = cryptoJS.lib.CipherParams.create({
          ciphertext: cryptoJS.enc.Base64.parse(jsonObj.ct)
        });
        if (jsonObj.iv) {
          cipherParams.iv = cryptoJS.enc.Hex.parse(jsonObj.iv);
        }
        if (jsonObj.s) {
          cipherParams.salt = cryptoJS.enc.Hex.parse(jsonObj.s);
        }
        return cipherParams;
      }
    };
    let loginData = [{ user: form.email, password: form.password }];
    let params = JSON.stringify(loginData)
    var ciphertext = cryptoJS.AES.encrypt(params, "quimerahealth_ftw", {
      format: JsonFormatter
    }).toString();
    return this.http.post(this.apiInicioSesion, { key: ciphertext });
  }

  iniciarSesion(){

    var correoElectronico = this.email
    var password = this.password
    var form = {
      email: correoElectronico,
      password: password
    }

    this.login(form).subscribe(data=>{
      if(data.token != 0){
        let dataUsuario = JSON.parse(atob(data.token));
        if(Object.keys(dataUsuario).length > 0){
          // Guardar información del usuario en el almacenamiento local
          localStorage.setItem('currentUser', dataUsuario);
          localStorage.setItem('token', data.token);
          this.sesionService.nombre = dataUsuario.user.nombre
          this.sesionService.idUser = dataUsuario.user.id
          this.sesionService.token = data.token
          this.sesionService.guardarCredenciales(); // Guardar las credenciales en el LocalStorage
          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        }
      }else{
        this.datosIncorrectos = true
      }
    });

  }
}
