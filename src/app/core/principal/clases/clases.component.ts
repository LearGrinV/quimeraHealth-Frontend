import { afterNextRender, Component, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../Shared/flowbite.service';
import { CommonModule } from '@angular/common';
import { UrlApiService } from '../../../Shared/url-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  // variables para mostrar las clases dispomiles
  clasesDisponibles: any = []

  // Rutas
  apiRutaClases = this.urlApi.url + '/api/clasesDisponibles'

  constructor(private flowbiteService:FlowbiteService,
              ) {
                afterNextRender(() => {
                  this.flowbiteService.loadFlowbite((flowbite) => {
                    console.log('Flowbite loaded', flowbite);
                  });
                });

                this.http.get(this.apiRutaClases).subscribe((datos:any)=> this.clasesDisponibles = datos.clases)
              }

  availableClasses: any = [
    { id: 1, name: 'Matemáticas', schedule: '8:00 AM', day: 'Lunes', available: true },
    { id: 2, name: 'Física', schedule: '10:00 AM', day: 'Lunes', available: true },
    { id: 3, name: 'Química', schedule: '2:00 PM', day: 'Martes', available: true },
    { id: 4, name: 'Historia', schedule: '9:00 AM', day: 'Miércoles', available: true },
    { id: 5, name: 'Literatura', schedule: '11:00 AM', day: 'Jueves', available: true },
  ];
  selectedClasses: any = [];


  toggleClass(clase: any): void {
    const index = this.selectedClasses.indexOf(clase);
    if (index === -1) {
      this.selectedClasses.push(clase);
    } else {
      this.selectedClasses.splice(index, 1);
    }
  }
}

