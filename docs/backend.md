backend.md

🚀 Documentación del Backend

⚙️ Configuración del Entorno y Ejecución

Para configurar y ejecutar el entorno del backend, sigue estos pasos:

Clonar el repositorio: git clone https://github.com/Jalitza/Jalitza-GestionCitasVentasCentroOptico_AOS.git

Acceder a la carpeta del backend: cd backend

Instalar dependencias con Maven: mvn install

Configurar la base de datos en el archivo application.properties o application.yml

Levantar el servidor con Spring Boot: mvnw spring-boot:run

📌 Tecnologías Utilizadas

Lenguaje de programación: Java

Framework: Spring Boot

Base de datos: PostgreSQL 

Servicios adicionales: Firebase (almacenamiento de archivos, autenticación)

IDE recomendado: Visual Studio Code o IntelliJ IDEA

📁 Estructura de Carpetas

src/main/java/com/gestionoptico/ → Contiene la lógica del negocio y la API REST.

controllers/ → Controladores que gestionan las solicitudes HTTP.

services/ → Servicios que implementan la lógica de negocio.

repositories/ → Repositorios que gestionan la persistencia de datos.

models/ → Definición de entidades y modelos de datos.

src/main/resources/ → Archivos de configuración del proyecto.

application.properties o application.yml → Configuración de la aplicación.

static/ → Archivos estáticos si es necesario.

src/test/java/ → Pruebas unitarias y de integración.

🚀 Este documento se irá actualizando a medida que avance el desarrollo del backend.

