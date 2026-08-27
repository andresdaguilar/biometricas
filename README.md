# Biométricas

App privada para registrar diariamente métricas corporales (peso, grasa visceral, % grasa, % músculo, edad biológica, cintura media/alta, bíceps izq/der), ver su evolución en gráficos por período y consultar máximos/mínimos históricos.

Stack: Next.js (App Router) + Drizzle ORM + Neon (Postgres) + Recharts. Pensado para desplegar en Vercel.

Autenticación simple de un único usuario (usuario/contraseña fijos, sesión de larga duración vía cookie firmada) — no hay registro público de usuarios.

## 1. Crear la base de datos en Neon

1. Crear un proyecto en [neon.tech](https://neon.tech).
2. Copiar el **connection string** (pooled connection) desde el dashboard de Neon.

## 2. Configurar variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

- `DATABASE_URL`: connection string de Neon.
- `AUTH_USERNAME`: usuario fijo (ej. `andresdaguilar`).
- `AUTH_PASSWORD_HASH`: hash bcrypt de la contraseña. Generar con:

  ```bash
  node -e "console.log(require('bcryptjs').hashSync('tu-password', 10))"
  ```

  **Importante**: Next.js interpola `$` dentro de los archivos `.env`. Hay que escapar cada `$` del hash como `\$` para que no se corrompa (ver ejemplo en `.env.example`).

- `AUTH_SECRET`: string aleatorio largo para firmar la sesión. Generar con:

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

## 3. Instalar dependencias y crear las tablas

```bash
npm install
npm run db:push
```

`db:push` sincroniza el esquema de `src/db/schema.ts` contra la base de Neon (crea la tabla `measurements`).

## 4. Correr en local

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) — redirige a `/login`.

## 5. Deploy en Vercel

1. Importar el repo en [vercel.com](https://vercel.com).
2. En **Environment Variables**, cargar `DATABASE_URL`, `AUTH_USERNAME`, `AUTH_PASSWORD_HASH` y `AUTH_SECRET` (mismos valores que en `.env.local`; en la UI de Vercel no hace falta escapar los `$`, solo en archivos `.env` locales).
3. Deploy. Antes del primer deploy (o cada vez que cambie el schema), correr `npm run db:push` apuntando a la base de producción.

## Estructura

- `src/app/(app)/registro` — formulario de carga diaria + últimos registros.
- `src/app/(app)/graficos` — evolución por métrica, con selector de período (1 semana, 14 días, 1 mes, 3 meses, Lifetime).
- `src/app/(app)/stats` — mínimos y máximos históricos por métrica, con fecha.
- `src/app/login` — login del único usuario.
- `src/proxy.ts` — protege todas las rutas excepto `/login`.
- `src/db/schema.ts` — esquema de la tabla `measurements`.
