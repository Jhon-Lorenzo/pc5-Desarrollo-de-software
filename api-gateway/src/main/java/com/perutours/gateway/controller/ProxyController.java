package com.perutours.gateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Enumeration;

@RestController
public class ProxyController {

    @Autowired
    private RestTemplate restTemplate;

    private static final String AUTH_URL    = "http://auth-service:8081";
    private static final String TOUR_URL    = "http://tour-service:8082";
    private static final String BOOKING_URL = "http://booking-service:8083";

    @RequestMapping("/api/auth/**")
    public ResponseEntity<Object> proxyAuth(
            HttpServletRequest request,
            @RequestBody(required = false) Object body) {
        return forward(request, body, AUTH_URL);
    }

    @RequestMapping("/api/tours/**")
    public ResponseEntity<Object> proxyTours(
            HttpServletRequest request,
            @RequestBody(required = false) Object body) {
        return forward(request, body, TOUR_URL);
    }

    @RequestMapping("/api/solicitudes/**")
    public ResponseEntity<Object> proxySolicitudes(
            HttpServletRequest request,
            @RequestBody(required = false) Object body) {
        return forward(request, body, BOOKING_URL);
    }

    private ResponseEntity<Object> forward(HttpServletRequest request, Object body, String targetBase) {
        String path = request.getRequestURI();
        String query = request.getQueryString();
        String targetUrl = targetBase + path + (query != null ? "?" + query : "");

        HttpMethod method = HttpMethod.valueOf(request.getMethod());

        System.out.println("[Gateway] Recibiendo peticion " + method + " para " + path);
        System.out.println("[Gateway] Redirigiendo a URL destino: " + targetUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Object> entity = new HttpEntity<>(body, headers);

        try {
            System.out.println("[Gateway] Enviando peticion via RestTemplate...");
            ResponseEntity<Object> response = restTemplate.exchange(URI.create(targetUrl), method, entity, Object.class);
            System.out.println("[Gateway] Respuesta recibida del microservicio: Status " + response.getStatusCode());
            
            // Retornamos un ResponseEntity limpio para evitar desajustes en Content-Length o Transfer-Encoding
            return ResponseEntity.status(response.getStatusCode())
                    .body(response.getBody());
        } catch (Exception e) {
            System.err.println("[Gateway] ERROR al conectar con el servicio: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Error al conectar con el servicio destino: " + e.getMessage());
        }
    }
}
