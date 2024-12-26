import { afterNextRender, Component, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../Shared/flowbite.service';
import { CommonModule } from '@angular/common';
import { UrlApiService } from '../../../Shared/url-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SesionService } from '../../../Shared/sesion.service';

@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.css',
})
export class ClasesComponent {

  private http = inject(HttpClient)
  private urlApi = inject(UrlApiService)
  private sesionService = inject(SesionService)

  // variables para mostrar las clases dispomiles
  clasesDisponibles: any = []

  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horasMañana = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'];
  horasTarde = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  horas = [...this.horasMañana, ...this.horasTarde];

  clasesMembresia : number = 0
  clasesRestantes : number = 0
  nombreMembresia : string = ''

  mostrarModalConfirmacion: boolean = false // Booleano para activar la modal de confirmación
  diaConfirmacion: any // Variable para guardar el día seleccionado en la modal de confirmación
  horaConfirmacion: any // Variable para guardar la hora seleccionada en la modal de confirmación


  // Rutas
  apiRutaClases = this.urlApi.url + '/api/clasesDisponibles'
  apiAlmacenarClases = this.urlApi.url + '/api/almacenarClases/'

  constructor(private flowbiteService:FlowbiteService
              ) {
                afterNextRender(() => {
                  this.flowbiteService.loadFlowbite((flowbite) => {
                    console.log('Flowbite loaded', flowbite);
                  });
                });
                
                // this.http.get(this.apiRutaClases).subscribe((datos:any)=> this.clasesDisponibles = datos.clases)
                this.clasesMembresia = this.sesionService.clasesMembresia
                // Convertir en json valido el this.sesionService.clasesReservadas
                this.sesionService.clasesReservadas != 0 ? this.clasesSeleccionadas = (JSON.parse(this.sesionService.clasesReservadas)) : null
                this.clasesRestantes = this.clasesMembresia - this.clasesSeleccionadas.length
              }

  // Array para almacenar las clases seleccionadas
  clasesSeleccionadas: { dia: string; hora: string; }[] = [];

  // función encargada de calcular la ultima hora de clases
  finClase(startTime: string): string {
    const [hora] = startTime.split(':');
    const ultimaHora = (parseInt(hora) + 1).toString().padStart(2, '0');
    return `${ultimaHora}:00`;
  }

  reservado(dia: string, hora: string): boolean {
    return this.clasesSeleccionadas.some(c => c.dia === dia && c.hora === hora);
  }

  libre(dia: string): boolean {
    const classesForDay = this.clasesSeleccionadas.filter(c => c.dia === dia);
    const totalClasses = this.clasesSeleccionadas.length;
    return classesForDay.length === 0 && totalClasses < this.clasesMembresia;
  }

  almacenarClase(dia: string, hora: string): void {
    if (this.libre(dia) && !this.reservado(dia, hora)) {
      this.clasesSeleccionadas.push({ dia, hora });
      this.http.put(this.apiAlmacenarClases + this.sesionService.idUser,this.clasesSeleccionadas).subscribe((data:any) => {
        this.sesionService.actualizarClasesReservadas(data.res.clasesReservadas)
        this.mostrarModalConfirmacion = false
        this.clasesRestantes = this.clasesRestantes - 1
      })
    }
  }

  // Función encargadad de activar y igualar las variables necesarias para la confirmacion 
  activarModalConfirmacion(dia:any, hora:any){
    this.diaConfirmacion = dia
    this.horaConfirmacion = hora
    this.mostrarModalConfirmacion = true
  }
}

