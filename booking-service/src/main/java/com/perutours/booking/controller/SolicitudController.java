package com.perutours.booking.controller;

import com.perutours.booking.model.Solicitud;
import com.perutours.booking.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudRepository solicitudRepository;

    @GetMapping
    public List<Solicitud> getAllSolicitudes() {
        return solicitudRepository.findAll();
    }

    @GetMapping("/usuario/{correo}")
    public List<Solicitud> getSolicitudesByUsuario(@PathVariable String correo) {
        return solicitudRepository.findByUsuarioCorreo(correo);
    }

    @PostMapping
    public Solicitud createSolicitud(@RequestBody Solicitud solicitud) {
        solicitud.setFechaSolicitud(LocalDate.now());
        solicitud.setEstado("Pendiente");
        
        // El frontend ahora enviará el montoTotal = (precio tour * cantidadPersonas)
        if (solicitud.getMontoTotal() == 0) {
            solicitud.setMontoTotal(999.0); // fallback si no envían precio
        }
        
        return solicitudRepository.save(solicitud);
    }

    @PutMapping("/{id}/estado")
    public Solicitud updateEstado(@PathVariable Long id, 
                                  @RequestParam String nuevoEstado,
                                  @RequestParam(required = false) String comentarioRechazo) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        solicitud.setEstado(nuevoEstado);
        
        if (comentarioRechazo != null && !comentarioRechazo.isEmpty()) {
            solicitud.setComentarioRechazo(comentarioRechazo);
        }
        
        return solicitudRepository.save(solicitud);
    }
}
