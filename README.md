# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Recuperación de contraseña

La aplicación envía los enlaces mediante Firebase Authentication al correo guardado en cada cuenta.

1. En Firebase Console, abrí **Authentication → Sign-in method** y habilitá **Email/Password**.
2. En **Authentication → Settings → Authorized domains**, agregá el dominio donde se ejecuta o publica la aplicación. Para desarrollo local, verificá que `localhost` esté autorizado.
3. En **Authentication → Templates**, revisá la plantilla **Password reset** y personalizá el remitente y el contenido si hace falta.
4. Asegurate de que los perfiles de `usuarios` tengan en `email` una dirección real a la que la persona pueda acceder. Antes de usar `/seed`, reemplazá los correos de prueba de `src/datos/usuarios.js` por direcciones controladas por el equipo.

Las cuentas nuevas se crean en Authentication con su correo real. Las cuentas antiguas que usan el alias `DNI@bala.app` se actualizan automáticamente al correo del perfil en su próximo inicio de sesión exitoso. Si una persona no puede iniciar sesión para completar esa actualización, administración debe cambiar el correo de esa cuenta en **Authentication → Users** por el correo del perfil antes de que pueda solicitar el restablecimiento.
