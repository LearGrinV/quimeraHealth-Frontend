import { Routes } from '@angular/router';
import path from 'path';
import { PrincipalComponent } from './core/principal/principal.component';
import { ClasesComponent } from './core/principal/clases/clases.component';
import { PasswordComponent } from './core/principal/password/password.component';

export const routes: Routes = [
    {path: '', pathMatch:'full',redirectTo:'quimeraClases'},
    {path: 'quimeraClases', component:ClasesComponent},
    {path: 'password', component:PasswordComponent}
];
