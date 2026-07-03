import { Rol } from './rol';
import { Modulo } from './modulo';

// Alineado con el JSON que devuelve el backend Spring Boot
export interface UserSesion {
  nombres: string;
  apellidos: string;
  correo: string;   // el backend devuelve 'correo', no 'email'
  rol: Rol;
  modulos?: Modulo[];
}
