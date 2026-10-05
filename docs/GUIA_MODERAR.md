# Cómo aprobar las ofertas del muro

Cada link que alguien comparte en el chat entra **"pendiente"** y no lo ve nadie más
hasta que lo aprobás. Tarda hasta 1 minuto en aparecer en la página después de aprobarlo.

## La forma fácil: tu panel de control

Abrí **https://luisalberto-git-main-javiersierra09-1633.vercel.app/admin**
(si te pide, iniciá sesión en Vercel con "Continue with Google").
Ahí ves las ofertas "Por revisar" con botones **Aprobar**, **Rechazar** y **Borrar**.
Guardalo en favoritos del navegador.

## La otra forma: desde Vercel

1. Entrá a https://vercel.com con **"Continue with Google"**.
2. Arriba, tocá **Storage** (o entrá a tu proyecto `luisalberto` → pestaña **Storage**).
3. Tocá **luisalberto-muro** → pestaña **Data Editor**.
4. Ahí está la tabla **publicaciones**. Cada fila es una oferta compartida.

Columnas importantes:
- **url**: el link. Abrilo para revisarlo antes de aprobar.
- **comentario**: lo que escribió la persona (puede estar vacío).
- **estado**: `pendiente`, `aprobada` o `rechazada`.
- **reportes**: cuántas personas la reportaron. Con 3 o más, deja de mostrarse sola.

## Aprobar o rechazar

1. Hacé doble clic en la celda **estado** de esa fila.
2. Escribí `aprobada` (para mostrarla) o `rechazada` (para que no aparezca nunca).
3. Apretá Enter para guardar.

## Qué revisar antes de aprobar

- Que el link lleve a una oferta de trabajo real (LinkedIn, Computrabajo, Bumeran, la web de la empresa…).
- Que no pida plata para postularse. **Si pide plata, es una estafa: rechazala.**
- Que el comentario no tenga insultos, datos personales ni publicidad.

## Cosas que pasan solas

- Las ofertas se borran solas a los **30 días**.
- Cada persona puede compartir hasta **3 ofertas por hora y 10 por día**.
- No se guarda el nombre, el mail ni la IP de nadie (la IP se convierte en un código que no se puede revertir).

## Si el Data Editor no te deja editar

Usá la pestaña **Query**, desactivá **Read-only** y corré (cambiando el link):

```sql
update publicaciones set estado = 'aprobada' where url = 'PEGÁ ACÁ EL LINK';
```
