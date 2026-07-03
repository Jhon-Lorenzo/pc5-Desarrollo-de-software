package com.perutours.tour.config;

import com.perutours.tour.model.Tour;
import com.perutours.tour.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TourRepository tourRepository;

    @Override
    public void run(String... args) throws Exception {
        // Para asegurar que los datos antiguos no afecten el bug de activo=null
        tourRepository.deleteAll();

        if (tourRepository.count() == 0) {
            Tour cusco = new Tour();
            cusco.setNombre("Cusco Imperial y Machu Picchu");
            cusco.setDias(5);
            cusco.setPrecio(699.0);
            cusco.setImagen("https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop&q=60");
            cusco.setActivo(true);

            Tour paracas = new Tour();
            paracas.setNombre("Aventura en Paracas e Ica");
            paracas.setDias(3);
            paracas.setPrecio(299.0);
            paracas.setImagen("https://images.unsplash.com/photo-1596484552834-6a58f840cbbe?w=800&auto=format&fit=crop&q=60");
            paracas.setActivo(true);

            Tour arequipa = new Tour();
            arequipa.setNombre("Colca Profundo Arequipa");
            arequipa.setDias(4);
            arequipa.setPrecio(399.0);
            arequipa.setImagen("https://images.unsplash.com/photo-1544908027-e9a385750dce?w=800&auto=format&fit=crop&q=60");
            arequipa.setActivo(true);

            tourRepository.saveAll(Arrays.asList(cusco, paracas, arequipa));
            System.out.println("======= DESTINOS CARGADOS EN TOUR-SERVICE (H2) =======");
        }
    }
}
