package com.perutours.tour.controller;

import com.perutours.tour.model.Tour;
import com.perutours.tour.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    @Autowired
    private TourRepository tourRepository;

    @GetMapping
    public List<Tour> getAllTours() {
        return tourRepository.findAll().stream()
                .filter(Tour::isActivo)
                .collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<Tour> getAllToursIncludingInactive() {
        return tourRepository.findAll();
    }

    @PostMapping
    public Tour createTour(@RequestBody Tour tour) {
        tour.setActivo(true);
        return tourRepository.save(tour);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tour> updateTour(@PathVariable Long id, @RequestBody Tour tourDetails) {
        return tourRepository.findById(id)
                .map(tour -> {
                    tour.setNombre(tourDetails.getNombre());
                    tour.setDias(tourDetails.getDias());
                    tour.setPrecio(tourDetails.getPrecio());
                    tour.setImagen(tourDetails.getImagen());
                    tour.setActivo(tourDetails.isActivo());
                    return ResponseEntity.ok(tourRepository.save(tour));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        return tourRepository.findById(id)
                .map(tour -> {
                    tour.setActivo(false);
                    tourRepository.save(tour);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
