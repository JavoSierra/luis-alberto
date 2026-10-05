# Luis Alberto

## Qué es
Página web para ayudar a gente de Argentina y LATAM que busca trabajo. Reúne ofertas de empleo de APIs públicas en un solo lugar, tiene un muro donde la comunidad comparte ofertas, y suma cursos gratuitos, recursos de inglés y herramientas para el CV.
Sin login ni datos personales de usuarios.
El dueño del proyecto NO es programador: viene de banco y administración y hoy es Analista de Calidad de IA. La página se arma con ayuda de IA. Explicarle todo en lenguaje simple, sin jerga, y guiarlo paso a paso cuando tenga que hacer algo él (instalar, crear cuentas, hacer clic).

## Tono
Cercano y argento (voseo), como un amigo que te ayuda a buscar laburo. Diseño profesional, limpio y moderno. Mobile first.

## Referencia visual
- `docs/prototipo.html` es la referencia principal: un prototipo en un solo archivo HTML, ya aprobado, con el diseño, los textos y el comportamiento resueltos. Abrirlo en el navegador y replicarlo en componentes. Los textos de la página se copian de ahí tal cual.
- `docs/diseno.png` (si está) es el mockup original. Sirve para las imágenes decorativas. Si hay diferencias, gana el prototipo.

## Stack
- Next.js (App Router) + React + Tailwind CSS
- Deploy: Vercel, conectado a GitHub. Sumar Vercel Analytics (sin cookies).
- Las APIs de empleo se consultan desde rutas de API de Next.js (servidor), con caché. Nunca desde el navegador.
- Supabase (base de datos) para el muro de "Compartir", en una etapa posterior al deploy.

## Estilo visual
- Paleta (tomar los valores exactos de las variables CSS del prototipo): verde oscuro, verde principal, salvia, verdes muy claros de fondo, grises con tinte verde. Definirlos como variables de Tailwind.
- Tipografía: Manrope para todo y Caveat para las notas manuscritas (Google Fonts, con next/font).
- Tarjetas con bordes redondeados, sombras muy suaves y mucho aire.
- Notas manuscritas inclinadas con flechitas en SVG.
- En celular: tarjetas en una columna y menú hamburguesa.
- Plantas, taza, libros y avatar: en el prototipo son dibujos simples provisorios. Si hay archivos en `/public/images`, usarlos; si no, mantener los dibujos y listar las imágenes pendientes. Lo decorativo no es prioridad: primero layout, tipografía y colores.

## Secciones (en este orden)
1. **Header fijo:** logo; menú Empleos, Compartir, Recursos, Sobre (scroll suave); botón verde "Un mejor futuro" que abre un menú con: Mis ofertas guardadas (con contador), Compartir una oferta, Mejorar mi CV.
2. **Hero:** como en el prototipo. **El chat estilo WhatsApp ES el muro de Compartir** (decisión del dueño, 5/10/2026): arriba los mensajes fijos de bienvenida y debajo las publicaciones aprobadas; su campo "Pegá una oferta..." publica ahí mismo. Mientras el muro real no exista, el campo va deshabilitado con un cartel "Próximamente".
3. **¿Por qué existe?**
4. **Oportunidades para vos** (empleos, ver más abajo).
5. **Oportunidades que se comparten:** solo explicación y reglas (texto del prototipo) con un botón que sube al chat del hero. No hay un segundo muro acá.
6. **Recursos gratuitos:** tres tarjetas que despliegan su lista de links. Links en archivos JSON dentro de `/data`, fáciles de editar. Verificar que cada link funcione antes de publicarlo.
7. **Sobre el proyecto:** texto del prototipo (historia real del autor). Foto o avatar, botones LinkedIn y GitHub con los links como variables a completar; si falta un link, no mostrar ese botón.
8. **Footer.**

## Empleos
### Criterio de región (lo más importante)
La página es para gente que busca desde Argentina y LATAM. Cada oferta se clasifica en una región:
- `Argentina`: el puesto está en Argentina (presencial, híbrido o remoto).
- `LATAM`: remoto abierto a Latinoamérica, o puesto en otro país de LATAM.
- `Global`: remoto abierto a cualquier país.
- `Otras`: restringido a otra región (solo EE.UU., solo Europa, etc.).

Filtro Región, con estas opciones:
- "Argentina y LATAM (todo lo que puedo aplicar)": opción por defecto. Muestra Argentina + LATAM + Global y oculta Otras.
- "Solo Argentina", "Solo remoto LATAM", "Solo remoto global".
- "Todas, incluso otras regiones".

Orden: primero Argentina, después LATAM, después Global, combinado con la fecha (en el prototipo: días de antigüedad + 2 por cada escalón de región). Si no se puede saber la región de una oferta, tratarla como `Otras`, no como `Global`.

### Fuentes
Verificar endpoints actuales, parámetros y condiciones de uso antes de integrar cada una. Estado al 5/10/2026:
- **Get on Board** (getonbrd.com): empleos de LATAM, sobre todo tecnología y digital. API pública sin registro. Falta confirmar en la documentación si filtra por país.
- **Himalayas** (`https://himalayas.app/jobs/api/search`): remotos, con parámetro `country`. Sin clave. Exige link visible a himalayas.app y mención de la fuente. Los datos se actualizan una vez por día.
- **Jobicy** (`https://jobicy.com/api/v2/remote-jobs`): remotos, con parámetro `geo`. Sin clave. Consultar los valores válidos con `?get=locations` (falta confirmar que exista LATAM). Exige mantener el link original de Jobicy y no consultar más de una vez por hora.
- **Remotive**: remotos globales, como complemento. Exige atribución y pocas consultas por día.
- **Jooble**: empleos locales de todo tipo. Requiere clave gratuita que se pide por formulario; va en variable de entorno. Integrarla solo cuando el dueño tenga la clave, y confirmar antes que cubra Argentina. Sus links pasan por Jooble.
- No usar Arbeitnow (casi todo Alemania/Europa).

Los empleos presenciales de Argentina fuera de tecnología casi no existen en APIs gratuitas. Esa parte la cubre el muro de Compartir.

### Reglas de integración
- Unificar en un formato común: título, empresa, logo, ubicación, región, jornada, modalidad, idioma, categoría, fecha, link, fuente.
- Tabla propia de categorías que unifique las de cada fuente.
- Eliminar duplicados y aplicar el orden de arriba.
- Timeout por fuente. Si una falla, la página sigue con las demás y aparece el aviso amarillo "Algunas fuentes pueden estar temporalmente fuera de línea."
- Caché de varias horas (mínimo 6), respetando el límite de cada fuente.
- Las descripciones vienen en HTML: nunca renderizarlas crudas.
- Logos: `<img>` común con fallback a iniciales sobre fondo de color. Nunca logos fijos en el código.

### Tarjeta y filtros
- Tarjeta: logo o iniciales, puesto, empresa, ubicación, etiquetas de jornada, modalidad e idioma ("En español" / "En inglés"), fecha relativa ("Hace 2 días"), "vía [fuente]", botón "Ver oferta" (abre la publicación original en otra pestaña) e ícono de guardar.
- Filtros: buscador, Categoría, Región, interruptor "Remoto", interruptor "Guardados".
- Guardados en localStorage, envueltos en try/catch.
- Mostrar 8 ofertas y botón "Ver más oportunidades". Estados de carga (esqueletos) y de "sin resultados".

## Muro de Compartir
Vive en el chat del hero (no en una sección aparte). Es un muro de links con estética de chat, NO un chat libre. Alguien que ve una búsqueda que le puede servir a otra persona pega el link y queda visible para todos.
- Cada publicación: una URL `https` + comentario opcional de hasta 120 caracteres. Nada más.
- Mostrar bien visible el dominio del link (ej. "linkedin.com").
- Moderación: toda publicación entra como `pendiente` y solo se muestra cuando el dueño la marca `aprobada` (al principio, desde el panel de Supabase).
- Anti abuso: límite de envíos por IP, campo trampa oculto (honeypot) contra bots, validación en el servidor.
- Privacidad: no se pide nombre ni mail. La IP se usa solo para el límite de envíos y se guarda hasheada, nunca en claro.
- Botón "Reportar" en cada publicación.
- Vencimiento automático a los 30 días.
- Aviso fijo: "Nunca pagues para postularte. Si una oferta te pide plata, es una estafa."
- Deseable: al pegar el link, traer título e imagen de la página desde el servidor (vista previa).
- El chat del hero muestra las publicaciones aprobadas debajo de los mensajes de bienvenida. Quien publica ve su mensaje "En revisión" hasta que se aprueba.

## Reglas
- No inventar endpoints ni datos. Si algo no funciona o hay dudas, avisar.
- Nada de API keys en el código: variables de entorno.
- Cada oferta redirige a la publicación original.
- Metadata y Open Graph completos: la página se va a compartir por WhatsApp y la vista previa importa.
- Código comentado en español.
- Antes de escribir código en una tarea nueva, mostrar el plan y esperar confirmación.
- Un commit por sección terminada.

## Estado
- [x] Base y estilo: header, hero, ¿Por qué existe?, footer (5/10/2026)
- [x] Empleos: fuentes, región, filtros, tarjetas, guardados (5/10/2026)
- [x] Recursos y Sobre el proyecto (5/10/2026)
- [x] Sección Compartir (explicación + botón al chat del hero) (5/10/2026)
- [ ] Deploy en Vercel y prueba en celular — publicada el 5/10/2026 en https://luisalberto.vercel.app (Vercel conectado a GitHub `JavoSierra/luis-alberto`: cada push a `main` publica solo). Falta la prueba en celular del dueño.
- [x] Muro real de Compartir con Supabase y moderación (vive en el chat del hero) (5/10/2026)

## Decisiones y pendientes
- Vercel Analytics agregado en `app/layout.tsx` y activado en el panel (plan Hobby, gratis). Proyecto de Vercel: `luisalberto` (cuenta javiersierra09, entra con Google). Guía para publicar: `docs/GUIA_PUBLICAR.md`.
- Pendiente del dueño: cuenta de Supabase (para el muro), nombre a mostrar, nivel de inglés, imágenes decorativas, clave de Jooble.
- Pendiente de verificar: cobertura de Argentina en Jooble.
- Get on Board (5/10/2026): no hay filtro por país documentado. Se traen las 100 ofertas más recientes de cada categoría (`/categories/{id}/jobs` con `expand` de empresa, ubicación y jornada) y la región se calcula con `remote_modality`, `location_tenants`, `location_regions` y `location_cities`. "fully_remote" = "100% remoto desde cualquier país" (verificado en la página de un aviso) → Global. "remote_local" sin países indicados → Otras.
- Criterio de región aplicado (lib/empleos/region.ts): remoto solo para Argentina → Argentina; remoto que incluye Argentina o toda LATAM (aunque sume otras regiones) → LATAM; remoto restringido a otros países (aunque sean de LATAM, ej. solo México) → Otras, porque desde Argentina no se puede aplicar; presencial/híbrido en otro país de LATAM → LATAM.
- "Solo remoto LATAM" y "Solo remoto global" filtran además por modalidad Remoto (las presenciales en Chile, por ejemplo, aparecen en la opción por defecto).
- Caché de empleos: `app/api/empleos/route.ts` es dinámica (no consulta fuentes al construir) y responde con `Cache-Control: s-maxage=21600` (6 h en la red de Vercel; 10 min si alguna fuente falló) + copia en memoria. Ofertas de más de 30 días se descartan. Duplicados = mismo puesto + misma empresa.
- Verificado 5/10/2026: Jobicy tiene `geo=latam` y `geo=argentina`. Himalayas `country=Argentina` mezcla ofertas globales: la región se calcula nosotros.
- Decidido 5/10/2026: arrancar con Jobicy, Himalayas y Get on Board. Remotive queda afuera (sus condiciones prohíben redistribuir a agregadores). Jooble en pausa: necesita clave por país (ar.jooble.org) y el plan gratis da 500 consultas en total.
- Proyecto movido fuera de OneDrive a `C:\Users\Javo\Proyectos\LuisAlberto`. Next.js 16 + Tailwind 4 + TypeScript. Colores en `app/globals.css` (@theme).
- Frase del karma ("Hoy compartís vos, mañana te comparten a vos. Es karma, no falla."): va en el hero, a la vista ni bien se entra (pedido del dueño). Reemplaza la nota "La misma búsqueda, más personas, más oportunidades."
- Decidido 5/10/2026: el muro real se hace en el orden previsto (después del deploy), con revisión previa de cada publicación.
- Recursos (5/10/2026): links verificados uno por uno. El de Canva del prototipo daba 404 → reemplazado por `/es_ar/crear/curriculum-vitae/`. Se sumaron Grow with Google y Microsoft Learn. British Council no respondió desde acá: quedó afuera. Cómo editar: `data/LEEME.md`.
- Recursos (5/10/2026, pedido del dueño): links siempre visibles (sin botón para desplegar) y buscador de cursos arriba (`components/recursos/BuscadorCursos.tsx` + `lib/cursos.ts`): muestra los cursos adentro de la página mientras se escribe, con foto, desde un catálogo propio verificado (`data/catalogo-cursos.json`, 56 cursos, 4 por cada uno de 14 temas). Entiende tildes, plurales, palabras a medio escribir y sinónimos (`palabras`). Debajo, atajos a la misma búsqueda en YouTube, Claseflix (`claseflix.io/buscar?s=`), Khan Academy, edX, freeCodeCamp y Google (`data/buscador.json`). Sin API ni claves. Sumados Claseflix y Capacítate para el empleo a Cursos.
- Portales de empleo (5/10/2026, pedido del dueño): bloque "¿Querés buscar en más lugares?" al final de Empleos (`components/empleos/PortalesEmpleo.tsx`, datos en `data/portales.json`): Argentina (Computrabajo, Bumeran, ZonaJobs, Indeed, LinkedIn, Portal Empleo) y Remoto y LATAM (Get on Board, Workana, Torre, Himalayas, Jobicy). Solo links directos, sin búsqueda prellenada (decisión del dueño: cada sitio pide su propio login). Ahora con selector de país (pedido del dueño): Argentina (de entrada), Uruguay, Chile, Paraguay, Bolivia, Perú, Ecuador, Colombia, Venezuela, México, Costa Rica y España (`data/portales-paises.json`). Debajo, siempre visibles: "Remoto, desde cualquier país" y "Entrenamiento de IA (trabajo por tarea)" (Outlier, DataAnnotation, Alignerr, micro1, CrowdGen, Turing, Mercor, Prolific) con aviso de que es freelance y de estafas. Portales oficiales que no abren desde fuera de su país quedaron afuera (ver `data/LEEME.md`).
- LinkedIn y GitHub: completar en `lib/config.ts` (REDES). Mientras estén vacíos, los botones no aparecen.
- IMPORTANTE: "Luis Alberto" era el papá de Javier (el dueño). La página lleva su nombre, pero Javier NO es Luis Alberto: nunca poner la foto de Javier asociada al nombre "Luis Alberto". El chat del hero usa el logo "LA", no una foto.
- Foto del autor (Javier Sierra) en `public/images/foto.webp` (5/10/2026): solo en Sobre el proyecto. LinkedIn cargado en `lib/config.ts`.
- Imágenes pendientes en `/public/images`: plantas, taza, libros (hoy son dibujos SVG en `components/Dibujos.tsx`).
- [Claude Code actualiza esta sección al final de cada sesión]
