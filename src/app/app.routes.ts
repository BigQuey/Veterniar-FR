import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MascotaComponent } from './dashboard/mascota/mascota.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FacturaComponent } from './dashboard/factura/factura.component';
import { DuenoComponent } from './dashboard/dueno/dueno.component';
import { HomeComponent } from './dashboard/home/home.component';
import { CrearDuenoComponent } from './dashboard/dueno/crear-dueno/crear-dueno.component';
import { EditarDuenoComponent } from './dashboard/dueno/editar-dueno/editar-dueno.component';
import { ServicioComponent } from './dashboard/servicio/servicio.component';
import { CrearMascotaComponent } from './dashboard/mascota/crear-mascota/crear-mascota.component';
import { EditarMascotaComponent } from './dashboard/mascota/editar-mascota/editar-mascota.component';
import { CrearServicioComponent } from './dashboard/servicio/crear-servicio/crear-servicio.component';
import { EditarServicioComponent } from './dashboard/servicio/editar-servicio/editar-servicio.component';
import { CrearFacturaComponent } from './dashboard/factura/crear-factura/crear-factura.component';
import { EditarFacturaComponent } from './dashboard/factura/editar-factura/editar-factura.component';
import { UsuarioComponent } from './dashboard/usuario/usuario.component';
import { CrearUsuarioComponent } from './dashboard/usuario/crear-usuario/crear-usuario.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'servicio', component: ServicioComponent },
            { path: 'mascota', component: MascotaComponent },
            { path: 'factura', component: FacturaComponent },
            { path: 'dueno', component: DuenoComponent },
            { path: 'usuario', component: UsuarioComponent },
            { path: 'dueno/crear', component: CrearDuenoComponent },
            { path: 'dueno/editar/:id', component: EditarDuenoComponent },
            { path: 'mascota/crear', component: CrearMascotaComponent },
            { path: 'mascota/editar/:id', component: EditarMascotaComponent },
            { path: 'servicio/crear', component: CrearServicioComponent },
            { path: 'servicio/editar/:id', component: EditarServicioComponent },
            { path: 'factura/crear', component: CrearFacturaComponent },
            { path: 'factura/editar/:id', component: EditarFacturaComponent },
            { path: 'usuario/crear', component: CrearUsuarioComponent }
            
        ]
    },
    { path: '**', component: LoginComponent }

];
