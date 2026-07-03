package com.perutours.auth.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserResponse {
    private String token;
    private UserSesion user;
    private boolean success;
    private String message;

    @Data
    public static class UserSesion {
        private String nombres;
        private String apellidos;
        private String correo;
        private RolDto rol;
        private List<ModuloDto> modulos;
    }

    @Data
    public static class RolDto {
        private String nombre;
    }

    @Data
    public static class ModuloDto {
        private String nombre;
        private String ruta;
    }
}
