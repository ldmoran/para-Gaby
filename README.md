# Para Gaby 🦋

Una pequeña experiencia romántica e interactiva: HTML5, CSS3 y JavaScript vanilla.
Proyecto 100 % estático (sin backend, base de datos ni servicios de pago).

## Estructura
```
index.html
css/styles.css
js/script.js
assets/            (carpetas reservadas para imágenes o fuentes propias)
```
Las flores, mariposas, luna y sobres son ilustraciones originales dibujadas en SVG/CSS.
Las fuentes (Cormorant Garamond y Great Vibes) se cargan desde Google Fonts.

## Música
Usa el reproductor oficial de YouTube (IFrame Player API); no hay archivos de audio.
1. Victor's Piano Solo (Corpse Bride OST): https://www.youtube.com/watch?v=j9GQDwiRjFc
2. San Lucas, Kevin Kaarl: https://www.youtube.com/watch?v=M5BQ5KWdhg8

La primera suena al abrir el sobre; la segunda empieza sola al llegar a "Un recuerdo que sigue sonando".
Si el navegador bloquea el audio, aparece un aviso para tocar ▶. Para cambiar una canción, edita el arreglo `SONGS` en `js/script.js`.

## Probar en local
YouTube necesita que la página se sirva por http, así que no abras el `index.html` con doble clic si quieres escuchar la música. Desde esta carpeta:

```bash
python -m http.server 8080
```
y abre http://localhost:8080 (o `npx serve`).

## Desplegar en Render (Static Site)
1. Sube la carpeta a un repositorio de GitHub (el contenido de `Gaby` en la raíz).
2. En https://render.com: **New +** → **Static Site** → conecta el repositorio.
3. Configura:
   - **Build Command:** déjalo vacío (o `echo ok`)
   - **Publish Directory:** `.`
4. **Create Static Site**. Render te dará una URL `https://nombre.onrender.com` para compartir.

Está pensada primero para el celular, pero se ve bien en computador.
