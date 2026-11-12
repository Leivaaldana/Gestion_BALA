# Gestion BALA

Aplicación React con Vite, Firebase y EmailJS.

## Desarrollo local

1. Instalá Node.js y npm.
2. Instalá las dependencias:

   ```sh
   npm install
   ```

3. Copiá `.env.example` a `.env.local` y completá las variables de Firebase y EmailJS.
4. Iniciá el servidor:

   ```sh
   npm run dev
   ```

## Despliegue en Vercel

1. Importá el repositorio en Vercel y dejá el directorio raíz como directorio del proyecto.
2. Configurá:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. En **Settings → Environment Variables**, agregá las variables de `.env.example` para cada entorno en el que se vaya a desplegar.
4. Desplegá el proyecto. `vercel.json` configura el fallback de las rutas de React Router para que funcionen también al abrir o recargar una ruta interna.

Las variables `VITE_*` se incorporan al bundle del navegador; no guardes secretos privados en ellas. La configuración web de Firebase y la clave pública de EmailJS son valores de cliente.

Después del primer despliegue, agregá el dominio de Vercel a los dominios autorizados de Firebase Authentication. Si usás el envío de correos con EmailJS, autorizá también el dominio en la configuración de EmailJS.

## Comandos

- `npm run dev`: servidor de desarrollo.
- `npm run build`: compilación de producción en `dist`.
- `npm run preview`: vista previa local de la compilación.
- `npm run lint`: análisis estático.
