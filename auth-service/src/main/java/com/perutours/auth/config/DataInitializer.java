package com.perutours.auth.config;

import com.perutours.auth.model.Modulo;
import com.perutours.auth.model.Rol;
import com.perutours.auth.model.Usuario;
import com.perutours.auth.repository.ModuloRepository;
import com.perutours.auth.repository.RolRepository;
import com.perutours.auth.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private ModuloRepository moduloRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        if (rolRepository.count() == 0) {
            // Módulos
            Modulo mInicio = new Modulo(); mInicio.setNombre("Inicio"); mInicio.setRuta("/dashboard");
            Modulo mSolicitar = new Modulo(); mSolicitar.setNombre("Solicitar Paquete"); mSolicitar.setRuta("/solicitud");
            Modulo mMisSolicitudes = new Modulo(); mMisSolicitudes.setNombre("Mis Solicitudes"); mMisSolicitudes.setRuta("/mis-solicitudes");
            Modulo mConsultar = new Modulo(); mConsultar.setNombre("Consultar Cotizaciones"); mConsultar.setRuta("/consultar-cotizaciones");
            Modulo mReportes = new Modulo(); mReportes.setNombre("Reportes Gerencia"); mReportes.setRuta("/reportes");

            moduloRepository.saveAll(Arrays.asList(mInicio, mSolicitar, mMisSolicitudes, mConsultar, mReportes));

            // Roles con módulos diferenciados
            Rol rolSocio = new Rol();
            rolSocio.setNombre("Socio");
            rolSocio.setModulos(Arrays.asList(mInicio, mSolicitar, mMisSolicitudes));

            Rol rolAgente = new Rol();
            rolAgente.setNombre("Agente Receptivo");
            rolAgente.setModulos(Arrays.asList(mInicio, mConsultar));

            Rol rolGerente = new Rol();
            rolGerente.setNombre("Gerente");
            // Gerente tiene acceso a cotizaciones Y a los reportes de gerencia
            rolGerente.setModulos(Arrays.asList(mInicio, mConsultar, mReportes));

            rolRepository.saveAll(Arrays.asList(rolSocio, rolAgente, rolGerente));

            // Usuarios Demo
            Usuario userSocio = new Usuario();
            userSocio.setNombres("Juan"); userSocio.setApellidos("Perez");
            userSocio.setCorreo("socio@perutours.com"); userSocio.setPassword("123456");
            userSocio.setRol(rolSocio);

            Usuario userAgente = new Usuario();
            userAgente.setNombres("Maria"); userAgente.setApellidos("Gomez");
            userAgente.setCorreo("agente@perutours.com"); userAgente.setPassword("123456");
            userAgente.setRol(rolAgente);

            Usuario userGerente = new Usuario();
            userGerente.setNombres("Carlos"); userGerente.setApellidos("Ramirez");
            userGerente.setCorreo("gerente@perutours.com"); userGerente.setPassword("123456");
            userGerente.setRol(rolGerente);

            usuarioRepository.saveAll(Arrays.asList(userSocio, userAgente, userGerente));
            System.out.println("======= DATOS DE USUARIOS CARGADOS EN AUTH-SERVICE (H2) =======");
        }
    }
}
