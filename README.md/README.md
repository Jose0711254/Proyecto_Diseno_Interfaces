# Práctica DIW: Web de Comunidad Tecnológica con Bootstrap y Scrum

Este repositorio contiene el proyecto de diseño y maquetación web para una comunidad tecnológica local sin ánimo de lucro. El desarrollo se ha realizado en equipo aplicando la metodología Scrum a lo largo de dos sprints.

## 👥 Integrantes
* [Nombre 1] ([@LucasMouris](https://github.com))
* [Nombre 2] ([@IkerRodriguez](https://github.com))
* [Nombre 3] ([@JoseLuisRey](https://github.com))


---

## 🛠️ Estado del Proyecto y Componentes Implementados

La web está prácticamente terminada, es completamente responsive (probada en 360px, 768px y 1280px) y cumple con los criterios de accesibilidad AA y validación W3C. 

Se compone de 3 páginas principales (**Inicio**, **Eventos** y **Únete**) maquetadas con **Bootstrap 5.3** y estructuradas con HTML semántico:

*   **Estructura Base:** Navbar global (desplegable en móvil con indicador de página activa) y Footer informativo de dos columnas.
*   **Sección Eventos:** Grid de tarjetas (`Cards`) para los ponentes y talleres, junto con un `Carousel` / `Acordeón` para destacar las actividades.
*   **Sección Únete:** Formulario interactivo con validación nativa de Bootstrap (mínimo 4 campos con sus `labels`) para el registro de socios y propuestas de charlas.
*   **Tablas e Iconos:** Implementación de tablas estilizadas (`table-striped`, `table-hover`) para los calendarios de cuotas y uso de **Bootstrap Icons**.
*   **Ventanas Modales:** Integración de componentes `Modal` funcionales y accesibles mediante teclado.
*   **Estilos personalizados:** El archivo CSS propio se ha limitado estrictamente a los detalles no cubiertos por Bootstrap y se encuentra totalmente comentado.

---

## 📅 Organización y Metodología

*   **Diseño Previo:** El desarrollo se basó en los wireframes, moodboard y la guía de estilos (colores y tipografías) aprobados por el cliente en el Sprint 1.
*   **Gestión Ágil:** Hemos utilizado un tablero de **GitHub Projects** (*Por hacer*, *En curso*, *Hecho*) para el seguimiento de las historias de usuario y el control de horas de trabajo.
*   **Control de Versiones:** El historial de Git refleja la colaboración equitativa del equipo con commits descriptivos de todos los miembros directamente en la rama `main`.