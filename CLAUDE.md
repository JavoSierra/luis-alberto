# Luis Alberto

## Qué es
Página web para ayudar a gente de Argentina y LATAM que busca trabajo: reúne ofertas de empleo de APIs públicas, tiene un muro (en el chat del hero) donde la comunidad comparte ofertas, un buscador de cursos gratis, recursos de inglés y herramientas para el CV, y links a portales de empleo por país.
Sin login ni datos personales de usuarios.

- Publicada en **https://luisalberto.vercel.app**
- Dueño: **Javier Sierra** (javiersierra09@gmail.com). NO es programador: viene de banco y administración y hoy es Analista de Calidad de IA. Explicarle todo en lenguaje simple, sin jerga, en español rioplatense (voseo), y guiarlo paso a paso cuando tenga que hacer algo él (clics, cuentas). Si algo lo puede hacer Claude, hacerlo en vez de pedírselo.
- **IMPORTANTE:** "Luis Alberto" era el papá de Javier. La página lleva su nombre, pero Javier NO es Luis Alberto: nunca poner la foto de Javier junto al nombre "Luis Alberto". El chat del hero usa el logo "LA".

## Cómo retomar (otra sesión u otra cuenta de Claude)
1. Abrir Claude Code en la carpeta `C:\Users\Javo\Proyectos\LuisAlberto` (no en OneDrive). Este archivo se lee solo.
2. Ver la página en la compu: `npm run dev` y abrir http://localhost:3000. En local el muro aparece como "Próximamente" porque las claves de Supabase solo están en Vercel (es normal).
3. Publicar un cambio: commit + `git push` a `main` → Vercel publica solo en ~30–60 s. Para probar algo riesgoso, usar una rama: Vercel arma una copia privada en `https://luisalberto-git-<rama>-javiersierra09-1633.vercel.app`.
4. Antes de cambiar algo de Next.js, leer la guía en `node_modules/next/dist/docs/` (Next.js 16 tiene cambios; ver AGENTS.md).
5. Al terminar cada tarea: commit, push y actualizar "Estado" y "Decisiones" acá.

## Cuentas y links (todo es del dueño, nada depende de una cuenta de Claude)
- **Página:** https://luisalberto.vercel.app
- **Panel de control privado:** https://luisalberto-git-main-javiersierra09-1633.vercel.app/admin (aprobar ofertas del muro, resumen, accesos rápidos). Se entra con la sesión de Vercel.
- **GitHub:** usuario `JavoSierra`, repo público https://github.com/JavoSierra/luis-alberto (entra con Google). En la compu, Git ya está autorizado (Git Credential Manager).
- **Vercel:** cuenta javiersierra09 (entra con "Continue with Google"), proyecto `luisalberto`, plan Hobby gratis, conectado a GitHub. Analytics activado (Hobby, gratis).
- **Supabase:** creado desde Vercel → Storage → `luisalberto-muro` (plan Free, región iad1). Variables de entorno con prefijo `SUPABASE_` cargadas solas en Vercel (Production y Preview). Editor de consultas y tablas: Vercel → Storage → luisalberto-muro → Query / Data Editor.
- Git en la compu: nombre "Javier Sierra", mail javiersierra09@gmail.com. Node.js 24 instalado.

## Stack
- Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript. Colores y fuentes en `app/globals.css` (@theme). Manrope + Caveat con next/font.
- Deploy: Vercel conectado a GitHub. Vercel Analytics (sin cookies) en `app/layout.tsx`.
- Empleos: rutas de API de Next.js (servidor) con caché. Nunca desde el navegador.
- Supabase para el muro (solo desde el servidor, con `SUPABASE_SECRET_KEY`).

## Mapa del código
- `app/page.tsx` arma la página. `app/layout.tsx`: fuentes, metadata, Open Graph, Analytics. `app/opengraph-image.tsx`: imagen para WhatsApp. `app/icon.svg`: ícono.
- `components/`: `Header`, `Hero`, `ChatBienvenida` (el chat = muro), `PorQue`, `Compartir`, `Sobre`, `Footer`, `Toast`, `Nota` (notas manuscritas), `Dibujos` (foto y dibujos).
- `components/empleos/`: `Empleos`, `Filtros`, `TarjetaEmpleo`, `LogoEmpresa`, `Esqueleto`, `PortalesEmpleo` (selector de país + remotos + IA).
- `components/recursos/`: `Recursos`, `BuscadorCursos`, `TarjetaCurso`, `TarjetaRecurso`.
- `components/admin/Panel.tsx` + `app/admin/page.tsx`: panel de control.
- `lib/empleos/`: fuentes (`fuentes/getonboard.ts`, `himalayas.ts`, `jobicy.ts`), `region.ts`, `categorias.ts`, `texto.ts`, `index.ts` (unifica, saca duplicados, ordena).
- `lib/muro/`: `servidor.ts` (Supabase, hash de IP, control de origen), `validar.ts`. `lib/admin.ts`: acceso al panel. `lib/cursos.ts`: búsqueda de cursos. `lib/guardados.ts`: ofertas guardadas (localStorage). `lib/config.ts`: datos del sitio y links de LinkedIn/GitHub.
- `app/api/empleos`, `app/api/muro`, `app/api/muro/reportar`, `app/api/admin/muro`: rutas del servidor.
- `data/` (editable a mano, instrucciones en `data/LEEME.md`): `cursos.json`, `ingles.json`, `cv.json`, `catalogo-cursos.json`, `buscador.json`, `portales.json`, `portales-paises.json`.
- `db/muro.sql`: estructura de la base del muro. `next.config.ts`: encabezados de seguridad.
- `docs/`: `prototipo.html` (referencia de diseño aprobada), `diseno.png`, `GUIA_PUBLICAR.md`, `GUIA_MODERAR.md`.

## Referencia visual
- `docs/prototipo.html` es la referencia principal (diseño, textos y comportamiento). `docs/diseno.png` es el mockup original, solo de estilo. Si hay diferencias, gana el prototipo, salvo lo que el dueño pidió cambiar (ver Decisiones).

## Secciones (en este orden)
1. **Header fijo:** logo; menú Empleos, Compartir, Recursos, Sobre; botón "Un mejor futuro" con: Mis ofertas guardadas (contador), Compartir una oferta, Mejorar mi CV.
2. **Hero:** textos del prototipo, nota del karma, y el **chat estilo WhatsApp que ES el muro** (mensajes de bienvenida + publicaciones aprobadas + campo para publicar).
3. **¿Por qué existe?**
4. **Oportunidades para vos:** empleos + "¿Querés buscar en más lugares?" (portales por país, remotos y entrenamiento de IA).
5. **Oportunidades que se comparten:** explicación y reglas del muro + botón que sube al chat.
6. **Recursos gratuitos:** buscador "¿Qué querés aprender hoy?" + tres tarjetas con links a la vista.
7. **Sobre el proyecto:** texto del prototipo, foto de Javier, botones LinkedIn y GitHub.
8. **Footer.**

## Empleos
- Fuentes activas: **Get on Board, Himalayas, Jobicy** (verificadas 5/10/2026). Remotive descartado (sus condiciones prohíben agregadores). Jooble en pausa (clave por país en ar.jooble.org, 500 consultas totales en el plan gratis). Arbeitnow descartado (Europa).
- Regiones: `Argentina`, `LATAM`, `Global`, `Otras`. Si no se puede saber, `Otras`. Criterio (lib/empleos/region.ts): remoto solo para Argentina → Argentina; remoto que incluye Argentina o toda LATAM → LATAM; remoto restringido a otros países (aunque sean de LATAM) → Otras; presencial/híbrido en otro país de LATAM → LATAM.
- Filtro Región: "Argentina y LATAM (todo lo que puedo aplicar)" (default, oculta Otras), "Solo Argentina", "Solo remoto LATAM" y "Solo remoto global" (estos dos exigen modalidad Remoto), "Todas".
- Orden: días de antigüedad + 2 por escalón de región. Ofertas de más de 30 días se descartan. Duplicados = mismo puesto + misma empresa.
- Get on Board: sin filtro por país documentado; se traen 100 ofertas por categoría con `expand` y la región se calcula con `remote_modality` y ubicaciones. "fully_remote" = "100% remoto desde cualquier país" → Global. "remote_local" sin países → Otras.
- Jobicy: `geo=argentina` y `geo=latam`; máximo una consulta por hora. Himalayas: `country=Argentina` mezcla globales.
- Caché: `app/api/empleos/route.ts` dinámica, `Cache-Control: s-maxage=21600` (6 h; 10 min si falló una fuente) + copia en memoria.
- Atribución visible a las tres fuentes con link. Descripciones HTML nunca se muestran. Logos con `<img>` y fallback a iniciales.

## Muro de Compartir (en el chat del hero)
- Publicación = URL https + comentario opcional ≤120 caracteres, escritos juntos en un solo campo. Se ve el dominio.
- Toda publicación entra `pendiente`; se muestra cuando el dueño la aprueba (panel /admin). Quien publica ve la suya "En revisión" (localStorage).
- Anti abuso: 3 por hora y 10 por día por IP hasheada (HMAC con la clave secreta, nunca la IP real), campo trampa `sitio`, solo pedidos con encabezado Origin de la propia página, cuerpo máx. 2 KB, freno general con 200 pendientes.
- "Reportar": una vez por persona; con 3 reportes se oculta. Vencimiento a los 30 días (se borran en cada publicación nueva).
- Base (`db/muro.sql`): tablas `publicaciones` y `reportes`, RLS activado sin políticas y permisos revocados a anon/authenticated; función `reportar_publicacion`. El editor Query de Vercel acepta una sola instrucción: para varias, envolver en `do $b$ begin ... end $b$;`.
- GET público cacheado 1 minuto.

## Seguridad (5/10/2026, pedido: "lo más segura posible")
- `next.config.ts`: CSP (imágenes solo de getonbrd-prod.s3.amazonaws.com, jobicy.com, cdn-images.himalayas.app, i.ytimg.com — si se suma otra fuente de imágenes, agregarla ahí), frame-ancestors none, nosniff, Referrer-Policy, Permissions-Policy, COOP, sin X-Powered-By.
- Verificado: ninguna clave en el código público; `npm audit --omit=dev` sin vulnerabilidades.
- Panel /admin: sin contraseña propia; solo responde en direcciones `*-javiersierra09-1633.vercel.app`, protegidas por Vercel Deployment Protection (piden iniciar sesión). En luisalberto.vercel.app da 404. **No desactivar Deployment Protection.**
- Pendiente del dueño: activar verificación en dos pasos en Google y GitHub.

## Reglas
- No inventar endpoints, datos ni links: verificar cada link antes de publicarlo (si un sitio bloquea robots, comprobarlo en el navegador).
- Nada de claves en el código: variables de entorno.
- Cada oferta y cada link llevan a la fuente original.
- Metadata y Open Graph completos (se comparte por WhatsApp).
- Código comentado en español.
- Antes de una tarea nueva grande, mostrar el plan y esperar confirmación.
- Un commit por sección o cambio terminado.

## Estado
- [x] Base y estilo: header, hero, ¿Por qué existe?, footer (5/10/2026)
- [x] Empleos: fuentes, región, filtros, tarjetas, guardados (5/10/2026)
- [x] Recursos y Sobre el proyecto (5/10/2026)
- [x] Sección Compartir (5/10/2026)
- [x] Deploy en Vercel (5/10/2026). Falta que el dueño la pruebe en su celular y compartiendo por WhatsApp.
- [x] Muro real con Supabase y moderación (5/10/2026)
- [x] Extras pedidos por el dueño (5/10/2026): buscador de cursos con catálogo propio, herramientas de CV, portales por país, plataformas de entrenamiento de IA, frase del karma, seguridad reforzada, panel de control.

## Decisiones tomadas con el dueño (5/10/2026)
- El chat del hero es el muro. La sección Compartir solo explica y lleva al chat.
- Frase del karma en el hero, a la vista ni bien se entra: "Hoy compartís vos, mañana te comparten a vos. Es karma, no falla." (reemplaza la nota "La misma búsqueda…"). Compartir conserva "Así entre todos nos ayudamos."
- El hero pasa a dos columnas (chat a la derecha) desde 700 px.
- Recursos: links siempre visibles. CV: HarvCV (pedido), Canva, Europass, FlowCV, Jobscan, Teal, Resume Worded. Canva del prototipo daba 404 → `/es_ar/crear/curriculum-vitae/`.
- Buscador de cursos: resultados adentro de la página desde `data/catalogo-cursos.json` (56 cursos verificados, 4 por tema, 14 temas) + atajos a YouTube, Claseflix (`claseflix.io/buscar?s=`), Khan Academy, edX, freeCodeCamp y Google. Sin API de YouTube (necesitaría clave).
- Portales: links directos sin búsqueda prellenada (cada sitio pide su login). Selector de país: Argentina, Uruguay, Chile, Paraguay, Bolivia, Perú, Ecuador, Colombia, Venezuela, México, Costa Rica, España. Portales oficiales que no abren desde fuera de su país quedaron afuera. InfoJobs solo en España.
- Plataformas de IA: Outlier, DataAnnotation, Alignerr, micro1, CrowdGen, Turing, Mercor, Prolific, con aviso de freelance y estafas.
- Foto de Javier en `public/images/foto.webp`, solo en Sobre. LinkedIn https://www.linkedin.com/in/javiersierra09/ y GitHub https://github.com/JavoSierra en `lib/config.ts`.

## Pendientes e ideas
- Dueño: verificación en dos pasos (Google y GitHub); probar en el celular; imágenes decorativas reales (plantas, taza, libros: hoy son dibujos en `components/Dibujos.tsx`).
- Ideas: aviso por mail al dueño cuando llega una oferta nueva al muro; vista previa del link (título e imagen) en el muro; renovar cursos viejos del catálogo; sumar portales de otros países si Vercel Analytics muestra visitas de ahí; Jooble si consigue la clave argentina.
- [Claude Code actualiza esta sección al final de cada sesión]
