# mi-portafolio

Portafolio de Dariela Fuenmayor, Performance Creative Designer.

Sitio estático (HTML, CSS y JavaScript sin dependencias ni paso de build).

## Estructura

```
index.html        Esqueleto de la página: header, footer y el contenedor #app
css/styles.css    Todos los estilos, organizados por secciones (ver índice al inicio del archivo)
js/data.js        Contenido: proyectos, anuncios, métricas de SkinUp, experiencia, herramientas, contacto
js/app.js         Router por hash (#home, #about, #work, #gallery, #contact, #case-…) y plantillas de cada página
images/           Creatividades y portadas (las de SkinUp vienen difuminadas por NDA)
```

## Editar contenido

Casi todo el texto y los números están en `js/data.js`. Por ejemplo:

- **Métricas de SkinUp**: `SKINUP_ADS` (inversión, ingresos y compras por anuncio). Los totales y el ROAS se calculan solos.
- **Proyectos de la página Work**: `PROJECTS`.
- **Experiencia (About)**: `EXPERIENCE`.
- **Testimonios**: `REVIEWS` (si `q` está vacío se muestra el texto de ejemplo).
- **Contacto**: `CONTACT` (email, LinkedIn, disponibilidad).

## Ver en local

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
```

## Publicar con GitHub Pages

En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**, elige la rama y la carpeta `/ (root)`.
