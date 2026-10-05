# Links de "Recursos gratuitos"

Cada archivo es una tarjeta de la sección Recursos:

- `cursos.json` → Cursos gratuitos
- `ingles.json` → Inglés para entrevistas
- `cv.json` → Herramientas para tu CV
- `catalogo-cursos.json` → los cursos que muestra el buscador "¿Qué querés aprender hoy?". Cada curso tiene `titulo`, `url`, `plataforma`, `autor`, `tipo`, `imagen` (solo YouTube), `tema` (los botones de temas salen de acá) y `palabras` (sinónimos para encontrarlo, en minúscula y sin tildes).
- `portales.json` → los portales de empleo de "¿Querés buscar en más lugares?" (sección Empleos), en dos grupos: Argentina y Remoto y LATAM.
- `buscador.json` → los sitios de los atajos "¿Querés más? Buscá en…". En cada `url`, `{q}` se reemplaza por lo que escribió la persona.

Para sumar un link, copiá una línea de `links` y cambiá `nombre`, `url` y `detalle`.
Cuidado con las comas: entre un link y otro va una coma, después del último no.
Antes de publicar, abrí el link en el navegador para confirmar que funciona.

Links verificados el 5/10/2026. El de Canva del prototipo (`/es_ar/curriculum-vitae/`) daba error 404 y se reemplazó.

Buscador (5/10/2026): cada dirección de búsqueda se probó en el navegador (Claseflix usa `/buscar?s=`; su vieja dirección claseflix.com redirige a claseflix.io).

CV (5/10/2026): HarvCV (pedido del dueño) verificado en el navegador (bloquea a robots con un control de Vercel, pero abre bien para las personas). Jobscan, Teal, FlowCV y Resume Worded verificados: todos declaran plan gratis en su página.

Catálogo de cursos (5/10/2026): 56 cursos, 4 por tema. Cada link de YouTube verificado con oEmbed; los demás abren y coinciden con el curso. Claseflix y Capacítate piden cuenta gratis.

Portales de empleo (5/10/2026): los 11 verificados en el navegador (Bumeran y ZonaJobs muestran ~9.300 avisos en Argentina; Indeed y Glassdoor bloquean robots pero abren bien para personas — Glassdoor no se sumó). InfoJobs no se usa: no opera en Argentina.
