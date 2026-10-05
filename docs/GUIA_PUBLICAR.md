# Cómo publicar la página (GitHub + Vercel)

Tiempo estimado: 20 minutos. No hace falta pagar nada.

- **GitHub** guarda una copia del proyecto en internet.
- **Vercel** toma esa copia y la convierte en una página con dirección propia (por ejemplo `luis-alberto.vercel.app`). Cada vez que se guarda un cambio en GitHub, Vercel actualiza la página sola.

## Paso 1: crear la cuenta de GitHub

1. Entrá a https://github.com/signup
2. Poné tu mail, una contraseña y un nombre de usuario (aparece en los links, elegí uno prolijo, ej. `javiersierra`).
3. Confirmá el mail con el código que te llega.

## Paso 2: crear el repositorio vacío

Un "repositorio" es la carpeta del proyecto en GitHub.

1. Entrá a https://github.com/new
2. En **Repository name** escribí `luis-alberto`.
3. Elegí **Public** (cualquiera puede ver el código; suma para tu perfil) o **Private** (solo vos).
4. **No** marques "Add a README", ni .gitignore, ni licencia: tiene que quedar vacío.
5. Tocá **Create repository** y copiá la dirección que aparece (termina en `.git`).
6. Pasale esa dirección a Claude. Claude sube el proyecto. La primera vez se abre una ventana para que inicies sesión en GitHub: aceptá.

## Paso 3: publicar con Vercel

1. Entrá a https://vercel.com/signup y elegí **Continue with GitHub** (usa la cuenta del paso 1). Plan: **Hobby** (gratis).
2. Tocá **Add New… → Project**.
3. Buscá `luis-alberto` en la lista y tocá **Import**. Si no aparece, tocá "Adjust GitHub App Permissions" y dale acceso a ese repositorio.
4. No cambies nada de la configuración: Vercel detecta que es Next.js. Tocá **Deploy**.
5. En uno o dos minutos aparece "Congratulations!" y la dirección de tu página.

## Paso 4: activar las estadísticas de visitas

1. En el proyecto de Vercel, entrá a la pestaña **Analytics**.
2. Tocá **Enable**. No usa cookies ni guarda datos personales.

## Paso 5: probar

1. Abrí la dirección en tu celular.
2. Mandate el link por WhatsApp para ver la vista previa (título, texto e imagen verde).
3. Contale a Claude qué viste. Si algo se ve raro, mandá captura.
