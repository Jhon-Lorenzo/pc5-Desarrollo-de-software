@echo off
cd /d "%~dp0"
echo ===================================================
echo   INICIANDO ECOSISTEMA DE MICROSERVICIOS - LOCAL   
echo ===================================================
echo.

echo 1/5 Iniciando Discovery Service (Eureka Server) en puerto 8761...
start "1. Discovery Service (8761)" cmd /k "cd discovery-service && .\mvnw.cmd spring-boot:run"
echo Esperando 12 segundos a que registre el servidor de Eureka...
timeout /t 12 /nobreak > null

echo 2/5 Iniciando API Gateway en puerto 8080...
start "2. API Gateway (8080)" cmd /k "cd api-gateway && .\mvnw.cmd spring-boot:run"

echo 3/5 Iniciando Auth Service en puerto 8081...
start "3. Auth Service (8081)" cmd /k "cd auth-service && .\mvnw.cmd spring-boot:run"

echo 4/5 Iniciando Tour Service en puerto 8082...
start "4. Tour Service (8082)" cmd /k "cd tour-service && .\mvnw.cmd spring-boot:run"

echo 5/5 Iniciando Booking Service en puerto 8083...
start "5. Booking Service (8083)" cmd /k "cd booking-service && .\mvnw.cmd spring-boot:run"

echo.
echo ===================================================
echo   Microservicios iniciados en ventanas separadas.  
echo ===================================================
pause
