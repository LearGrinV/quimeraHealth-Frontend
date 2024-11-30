import { afterNextRender, Component } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './Shared/flowbite.service';
import { PrincipalComponent } from "./core/principal/principal.component";
import { CommonModule } from '@angular/common';
import { SesionService } from './Shared/sesion.service';
import { DashboardComponent } from "./core/principal/dashboard/dashboard.component";
import { bootstrapApplication } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PrincipalComponent, DashboardComponent, CommonModule, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pruebaAngularQuimera';

  // ngOnInit(): void {
  //   this.flowbiteService.loadFlowbite(flowbite => {});
  // }

  sesionIniciada(){
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? true  : false;
  }
}
