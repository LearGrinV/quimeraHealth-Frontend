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

  mostrarModalSesion:boolean = false
  mostrarModalSuscripcion:boolean = false

  // Variables para el formulario de inicio de sesion
  email: string = '';
  password: string = '';

  // Variables para el formulario de suscripcion
  nombreUsuario: string = ''
  correoUsuario: string = ''
  telefonoUsuario: number = 9
  fechaNacimientoUsuario : string = ''
  antecedentesMedicosUsuario: string = ''
  comprobantePago : any 
  precioMensual : any
  precioTrimestral : any
  

  numeroString: string = ''

  datosIncorrectos:boolean = false;
  mensajeError : string = ''

  membresias : any = []
  membresiaSeleccionada: any = []

   // Rutas
  private apiInicioSesion = this.urlApi.url + '/api/login'
  private apiDatos = this.urlApi.url + '/api/quimeraBcnd'
  private apiMembresiaEspecifica = this.urlApi.url + '/api/membresiaEspecifica/'
  private apiSuscripcion = this.urlApi.url + '/api/sucripcion'

  constructor(private router:Router,
              private sesionService:SesionService
              ){
                this.http.get(this.apiDatos).subscribe((datos:any) => this.membresias = datos)
              }

  telefono(event:any){
    var valor = event.target.value
    // Detener el evento del input al ingresar mas de 9 digitos
    event.target.value = valor.length > 9 ? valor.substring(0, 9) : valor

  }

  // Modal Inicio sesion
  abrirModalInicioSesion(){
    this.mostrarModalSesion = true
    setTimeout(() => {
      this.emailInput.nativeElement.focus()
    },1)
  }

  cerrarModalInicioSesion() {
    this.mostrarModalSesion = false;
  }

  // Suscripcion

  abrirModalSuscripcion(datosMembresia:any){
    this.mostrarModalSuscripcion = true
    this.precioMensual = true
    this.precioTrimestral = false
    this.http.get(this.apiMembresiaEspecifica + datosMembresia.id).subscribe((dato:any) => this.membresiaSeleccionada = dato)
    this.precioMensual = true;
  }

  archivoComprobantePago(event: Event):void{
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        this.comprobantePago = base64Image
      };
      reader.readAsDataURL(file);
    }
  }

  iniciarSuscripcion(){   
    var form = {
      name: this.nombreUsuario,
      email: this.correoUsuario,
      telefono: this.telefonoUsuario,
      fechaNacimiento: this.fechaNacimientoUsuario,
      antecedentesMedicos: this.antecedentesMedicosUsuario,
      idMembresia: this.membresiaSeleccionada.id,
      nombreMembresia : this.membresiaSeleccionada.nombre,
      precioMebresia: this.precioMensual ? this.membresiaSeleccionada.precioMensual : this.membresiaSeleccionada.precioTrimestral,
      comprobantePago: this.comprobantePago
    }

    this.http.post(this.apiSuscripcion,form).subscribe((data:any) => {
        this.nombreUsuario = '',
        this.correoUsuario = '',
        this.telefonoUsuario = 9,
        this.fechaNacimientoUsuario = '',
        this.antecedentesMedicosUsuario = ''
        this.mostrarModalSuscripcion = false
      }
    )

  }

  onCheckboxChange(tipo: string): void {
    if (tipo === 'mensual') {
      if (this.precioMensual) {
        this.precioTrimestral = false; // Desmarcar trimestral si mensual es seleccionado
      }
    } else if (tipo === 'trimestral') {
      if (this.precioTrimestral) {
        this.precioMensual = false; // Desmarcar mensual si trimestral es seleccionado
      }
    }
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
          this.sesionService.mailConfirmed = dataUsuario.user.mail_confirmed
          this.sesionService.clasesMembresia = dataUsuario.user.clasesMembresia
          this.sesionService.clasesReservadas  = dataUsuario.user.clasesReservadas
          this.sesionService.guardarCredenciales(); // Guardar las credenciales en el LocalStorage
          this.router.navigate(['/']).then(() => {
            window.location.href = '/';
          });
        }
      }else{
        this.datosIncorrectos = true
        this.mensajeError = data.mensaje
      }
    });

  }
}
