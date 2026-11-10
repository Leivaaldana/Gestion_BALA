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

## Formulario de contacto y respuestas por correo

El formulario guarda cada consulta en `reclamos`. El rol `administrativo` la ve en tiempo real en **Gestión de reclamos**. Las respuestas se envían desde el navegador con EmailJS y luego quedan registradas en Firestore. El plan gratuito de EmailJS incluye 200 solicitudes mensuales, sin tarjeta de crédito; al exceder el límite, los envíos no estarán disponibles hasta el siguiente ciclo o un cambio de plan. Revisá el [precio y límites actuales](https://www.emailjs.com/pricing/).

### Configuración de EmailJS

1. Creá una cuenta gratuita en EmailJS y conectá el Gmail desde el que se responderán los reclamos. No hace falta configurar una contraseña SMTP en la app.
2. Creá una plantilla de correo. Configurá **To Email** como `{{to_email}}`, el asunto como `{{subject}}` y el contenido usando `{{to_name}}` y `{{message}}`. El remitente debe ser la cuenta Gmail conectada.
3. Copiá el Service ID, Template ID y Public Key de EmailJS a las variables locales siguientes. El archivo `.env` no se versiona; reiniciá Vite después de editarlo:

```env
VITE_EMAILJS_SERVICE_ID=service_id
VITE_EMAILJS_TEMPLATE_ID=template_id
VITE_EMAILJS_PUBLIC_KEY=public_key
```

La Public Key de EmailJS se usa en el navegador y no es una contraseña SMTP. Aun así, configurá restricciones de origen y protecciones anti-abuso en EmailJS; la clave pública permite invocar el servicio y el plan gratuito tiene un límite mensual.

### Seguridad de Firestore

El proyecto no tiene reglas de Firestore versionadas. Integrá estas reglas dentro del bloque existente `match /databases/{database}/documents`; no reemplaces las reglas actuales. Revisá y limitá cualquier regla comodín permisiva (`match /{document=**}`), porque Firebase combina permisos de forma aditiva y una regla general abierta anularía en la práctica estas restricciones.
Para cada cuenta administradora, obtené su UID en **Authentication → Users** y creá desde la consola el documento `administradores/{UID}` con `{ "activo": true }`. Las reglas impiden crear o modificar estos documentos desde la app.

```text
function esAdministrativo() {
  return request.auth != null
    && exists(/databases/$(database)/documents/administradores/$(request.auth.uid))
    && get(/databases/$(database)/documents/administradores/$(request.auth.uid)).data.activo == true;
}

match /administradores/{uid} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow write: if false;
}

match /usuarios/{dni} {
  allow get: if request.auth != null
    && (
      resource.data.email == request.auth.token.email
      || request.auth.token.email == dni + "@bala.app"
    );
  allow list: if request.auth != null
    && (
      resource.data.email == request.auth.token.email
      || resource.data.rol == "medico"
    );
  allow create: if request.auth != null
    && request.resource.data.keys().hasOnly([
      "dni", "nombre", "apellido", "email", "rol"
    ])
    && request.resource.data.dni == dni
    && request.resource.data.email == request.auth.token.email
    && request.resource.data.rol == "paciente";
  allow update, delete: if false;
}

match /reclamos/{reclamoId} {
  allow create: if request.resource.data.keys().hasOnly([
      "nombre", "email", "asunto", "mensaje", "estado", "respuestas", "creadoEn"
    ])
    && request.resource.data.nombre is string
    && request.resource.data.nombre.size() > 0
    && request.resource.data.nombre.size() <= 100
    && request.resource.data.email is string
    && request.resource.data.email.size() <= 254
    && request.resource.data.email.matches("^[^@]+@[^@]+[.][^@]+$")
    && request.resource.data.asunto is string
    && request.resource.data.asunto.size() > 0
    && request.resource.data.asunto.size() <= 150
    && request.resource.data.mensaje is string
    && request.resource.data.mensaje.size() > 0
    && request.resource.data.mensaje.size() <= 5000
    && request.resource.data.estado == "Pendiente"
    && request.resource.data.respuestas == [];
  allow read: if esAdministrativo();
  allow update: if esAdministrativo()
    && request.resource.data.diff(resource.data).affectedKeys()
      .hasOnly(["estado", "respuestas", "actualizadoEn"])
    && request.resource.data.estado == "Respondido"
    && request.resource.data.respuestas.size() == resource.data.respuestas.size() + 1;
  allow delete: if false;
}

```

La creación de reclamos es pública para permitir consultas sin iniciar sesión; protegé el proyecto con Firebase App Check y considerá mecanismos anti-spam antes de publicarlo ampliamente. El envío del correo usa EmailJS y no requiere Blaze, Cloud Functions ni una extensión de Firebase.
