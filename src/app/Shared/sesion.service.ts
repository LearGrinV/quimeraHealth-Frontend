import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class SesionService {

  sesion:boolean = false

  nombre: any
  idUser: any
  token: any
  mailConfirmed: any
  clasesMembresia:any
  clasesReservadas: any
  storageKey = 'credenciales'; // Clave para el LocalStorage

  // Funciones para mantener la sesion activa
  guardarCredenciales() {
    const data = {
      nombre: this.nombre,
      idUser: this.idUser,
      token: this.token,
      mailConfirmed: this.mailConfirmed,
      clasesMembresia: this.clasesMembresia,
      clasesReservadas: this.clasesReservadas,
      expiracion: Date.now() + 8 * 60 * 60 * 1000
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  cargarCredenciales() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData.expiracion > Date.now()) {
        this.nombre = parsedData.nombre;
        this.idUser = parsedData.idUser;
        this.token = parsedData.token;
        this.mailConfirmed = parsedData.mailConfirmed
        this.clasesMembresia = parsedData.clasesMembresia,
        this.clasesReservadas = parsedData.clasesReservadas
      } else {
        this.limpiarCredenciales()
      }
    }
  }

  actualizarPassword(mail:any){
    const data = {
      nombre: this.nombre,
      idUser: this.idUser,
      token: this.token,
      mailConfirmed: mail,
      clasesMembresia: this.clasesMembresia,
      clasesReservadas: this.clasesReservadas,
      expiracion: Date.now() + 8 * 60 * 60 * 1000
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  actualizarClasesReservadas(clasesReservadas:any){
    const data = {
      nombre: this.nombre,
      idUser: this.idUser,
      token: this.token,
      mailConfirmed: this.mailConfirmed,
      clasesMembresia: this.clasesMembresia,
      clasesReservadas: clasesReservadas,
      expiracion: Date.now() + 8 * 60 * 60 * 1000
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  limpiarCredenciales() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('currentUser');
  }

  cerrarSesion() {
    this.limpiarCredenciales();
    this.nombre = '';
    this.idUser = '';
    this.token = '';
    this.mailConfirmed = '';
    this.clasesMembresia = '';
    this.clasesReservadas = '';
  }


}
