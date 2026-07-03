package com.perutours.tour.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tours")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private int dias;

    private double precio;

    private String imagen;

    private boolean activo = true;
}

