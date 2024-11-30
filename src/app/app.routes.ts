import { Routes } from '@angular/router';
import path from 'path';
import { PrincipalComponent } from './core/principal/principal.component';
import { ClasesComponent } from './core/principal/clases/clases.component';

export const routes: Routes = [
    {path: '', pathMatch:'full',redirectTo:'quimeraClases'},
    {path: 'quimeraClases', component:ClasesComponent}
];
