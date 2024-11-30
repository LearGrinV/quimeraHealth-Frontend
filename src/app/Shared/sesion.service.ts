import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class SesionService {

  sesion:boolean = false

  nombre: any
  idUser: any
  token: any
  storageKey = 'credenciales'; // Clave para el LocalStorage

  // Funciones para mantener la sesion activa
  guardarCredenciales() {
    const data = {
      nombre: this.nombre,
      idUser: this.idUser,
      token: this.token,
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
      } else {
        this.limpiarCredenciales()
      }
    }
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
  }


}
