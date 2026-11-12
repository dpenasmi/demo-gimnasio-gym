# A Tu Ritmo · Demo GYM

Home construida con Astro, HTML semántico y CSS responsive, basada en los dos wireframes facilitados.

## Desarrollo

```sh
npm install
npm run dev
```

## Producción

```sh
npm run build
npm run preview
```

El resultado estático queda en `dist/`. Se puede desplegar en cualquier hosting estático. Las rutas se han preparado para la raíz del dominio.

## Contenido

- Hero, modalidades, carrusel de clases, spot, instalaciones, comunidad, primera sesión, preguntas y reserva.
- Menú móvil, navegación interna, modales accesibles nativos, FAQ y formulario validado.
- El formulario es una demostración: no transmite ni almacena datos.
- Los horarios son ilustrativos, no información de un negocio real.
- Fotografías de secciones extraídas de los wireframes aportados. Hero generado para esta demo. Las tipografías usan Google Fonts con alternativas del sistema.

## Incorporar el spot

Copia el MP4 final a `public/video/spot.mp4`. En `src/pages/index.astro`, cambia `const spotUrl = '';` por `const spotUrl = '/video/spot.mp4';`. Vuelve a ejecutar `npm run build`.

Para una publicación real: conectar formulario a un proveedor, introducir datos reales del gimnasio y revisar los textos legales y de privacidad.
