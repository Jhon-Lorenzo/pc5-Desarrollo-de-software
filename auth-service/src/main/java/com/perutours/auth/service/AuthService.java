package com.perutours.auth.service;

import com.perutours.auth.dto.UserRequest;
import com.perutours.auth.dto.UserResponse;
import com.perutours.auth.model.Rol;
import com.perutours.auth.model.Usuario;
import com.perutours.auth.repository.RolRepository;
import com.perutours.auth.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    public UserResponse login(UserRequest request) {
        UserResponse response = new UserResponse();

        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoAndPassword(request.getEmail(), request.getContrasena());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            response.setSuccess(true);
            response.setMessage("Login exitoso");
            response.setToken("dummy-jwt-token-for-demo");

            UserResponse.UserSesion sesion = new UserResponse.UserSesion();
            sesion.setNombres(usuario.getNombres());
            sesion.setApellidos(usuario.getApellidos());
            sesion.setCorreo(usuario.getCorreo());

            UserResponse.RolDto rolDto = new UserResponse.RolDto();
            rolDto.setNombre(usuario.getRol().getNombre());
            sesion.setRol(rolDto);

            sesion.setModulos(usuario.getRol().getModulos().stream().map(modulo -> {
                UserResponse.ModuloDto dto = new UserResponse.ModuloDto();
                dto.setNombre(modulo.getNombre());
                dto.setRuta(modulo.getRuta());
                return dto;
            }).collect(Collectors.toList()));

            response.setUser(sesion);
        } else {
            response.setSuccess(false);
            response.setMessage("Credenciales incorrectas");
        }

        return response;
    }

    public UserResponse registro(Usuario usuario) {
        UserResponse response = new UserResponse();
        if (usuarioRepository.findByCorreoAndPassword(usuario.getCorreo(), usuario.getPassword()).isPresent()) {
            response.setSuccess(false);
            response.setMessage("El correo ya está registrado");
            return response;
        }

        // Asignar rol Socio por defecto
        Rol rolSocio = rolRepository.findAll().stream()
                .filter(r -> r.getNombre().equalsIgnoreCase("Socio"))
                .findFirst()
                .orElse(null);
        usuario.setRol(rolSocio);

        usuarioRepository.save(usuario);
        response.setSuccess(true);
        response.setMessage("Usuario registrado con éxito");
        return response;
    }
}
