package com.perutours.booking.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "solicitudes")
public class Solicitud {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String usuarioCorreo;

    @Column(nullable = false)
    private String destino;

    private LocalDate fechaSolicitud;

    private LocalDate fechaViaje;

    private int cantidadPersonas;

    private String estado;

    private double montoTotal;

    private String comentarioRechazo;
}
