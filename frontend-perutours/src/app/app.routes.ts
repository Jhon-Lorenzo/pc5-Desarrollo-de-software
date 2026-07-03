import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { InicioSesion } from './components/inicio-sesion/inicio-sesion';
import { RegistrarPersona } from './components/gestion-mantenimiento/registrar-persona/registrar-persona';
import { Dashboard } from './components/dashboard/dashboard';
import { SolicitarPaquete } from './components/solicitar-paquete/solicitar-paquete';
import { MisSolicitudes } from './components/mis-solicitudes/mis-solicitudes';
import { ConsultarCotizaciones } from './components/consultar-cotizaciones/consultar-cotizaciones';
import { ReportesGerente } from './components/reportes-gerente/reportes-gerente';
import { CatalogoPaquetes } from './components/catalogo-paquetes/catalogo-paquetes';
import { AdminPaquetes } from './components/admin-paquetes/admin-paquetes';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: InicioSesion },
    { path: 'registro', component: RegistrarPersona },
    { path: 'dashboard', component: Dashboard },
    { path: 'solicitud', component: SolicitarPaquete },
    { path: 'mis-solicitudes', component: MisSolicitudes },
    { path: 'catalogo', component: CatalogoPaquetes },
    { path: 'admin-paquetes', component: AdminPaquetes },
    { path: 'consultar-cotizaciones', component: ConsultarCotizaciones },
    { path: 'reportes', component: ReportesGerente },
    { path: '**', redirectTo: '' }
];
