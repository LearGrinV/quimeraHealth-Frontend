import { afterNextRender, Component } from '@angular/core';
import { FlowbiteService } from '../../../Shared/flowbite.service';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { SesionService } from '../../../Shared/sesion.service';
import { PasswordComponent } from "../password/password.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, PasswordComponent,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {  

  passwordConfirmed : boolean = false;
  
  constructor(private flowbiteService:FlowbiteService,
              private router:Router,
              private sesionService:SesionService
            ){
              afterNextRender(() => {
                this.flowbiteService.loadFlowbite((flowbite) => {
                  console.log('Flowbite loaded', flowbite);
                });
              });

              sesionService.cargarCredenciales()
              this.passwordConfirmed = this.sesionService.mailConfirmed ? false : true
            }

  ngOnInit(){
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    // Change the icons inside the button based on previous settings
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      themeToggleLightIcon!.classList.remove('hidden');
    } else {
      themeToggleDarkIcon!.classList.remove('hidden');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn!.addEventListener('click', () => {
      // Toggle icons inside button
      themeToggleDarkIcon!.classList.toggle('hidden');
      themeToggleLightIcon!.classList.toggle('hidden');

      // If set via local storage previously
      if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        }

      // If NOT set via local storage previously
      } else {
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        }
      }
    });
  }

  //Funcion encargada de cerrar la sesion del usuario
  cerrarSesion(){
    this.sesionService.cerrarSesion()
    this.router.navigateByUrl('/',{skipLocationChange: true}).then();
  }

  //Funcion encargada de redirecciona a la ruta de clases 
  abrirRutaClases(){
    this.router.navigate(['quimeraClases'])
  }

  //Funcion encargada de redireccionar a mi perfil
  abrirMiPerfil(){
    this.router.navigate(['perfil'])
  }

}
