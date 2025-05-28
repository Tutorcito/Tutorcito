
# 📘 Tutorcito

> Plataforma web para conectar estudiantes con tutores expertos de forma simple, rápida y validada.

---

## 🎯 Objetivo del Proyecto

**Tutorcito** busca facilitar la conexión entre estudiantes y tutores de diversas disciplinas, permitiendo:

- Registro rápido y verificado de tutores.
- Validación de conocimientos mediante documentos.
- Publicación de materias ofrecidas.
- Reserva de tutorías vía Calendly.
- Un proceso de onboarding guiado y personalizado.

---

## ✨ Funcionalidades Principales

- ✅ Registro e inicio de sesión usando Supabase Auth.
- ✅ Onboarding paso a paso para tutores (subida de certificados, elección de materias, calendario).
- ✅ Carga de documentos a Supabase Storage.
- ✅ Uso dinámico de imágenes de fondo desde Unsplash.
- ✅ Variedad de tutores disponibles en la plataforma.
- ✅ Pago fácil y seguro con MercadoPago.
- ✅ Sistema de comentarios y ranking para tutores populares.
- ✅ Plan premium pago para tutores con beneficios varios.

---

## 🖼 Diseño en Figma

Podés acceder al diseño, guía de estilos y sistema de UI acá:
🔗 [Figma Tutorcito](https://www.figma.com/design/ojD4F4t6S5tf3hq5rcg9eB/Tutorcito---Web-de-tutor%C3%ADas?node-id=139-57&t=blbocGYhYWr8X78c-1)

---

## 🛠 Tecnologías Usadas

- **Next.js 15** con App Router
- **Supabase** (Autenticación, Base de Datos, Almacenamiento de archivos)
- **TailwindCSS** (Estilos y comporttamiento Responsive)
- **Shadcn UI** (Componentes de React pre-armados)
- **TypeScript** (Manejo de errores y tipado)
- **Lucide React Icons** (Iconos e imágenes)

---

## 🚀 Instrucciones para Clonar y Ejecutar

```bash
# 1. Cloná el repositorio
git clone https://github.com/tu-usuario/tutorcito.git

# 2. Entrá al proyecto
cd tutorcito

# 3. Instalá dependencias
npm install

# 4. Agregá variables de entorno (crear archivo .env.local)
touch .env.local
```

### `.env.local` ejemplo

```JavaScript
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
# 5. Iniciá el servidor local
npm run dev
```

---

## 🤝 Cómo Colaborar

1. 🔧 Hacé un fork del repositorio.
2. 🧪 Creá una nueva rama: `git checkout -b feature/mi-nueva-feature`.
3. ✅ Hacé tus cambios y asegurate que el proyecto corre localmente.
4. 🔁 Abrí un Pull Request describiendo qué implementaste y por qué.

---

## 💬 Feedback & Sugerencias

¡Tu feedback es bienvenido! Podés:

- Abrir un [issue](https://github.com/JoaquinCortezHub/tutorcito/issues)
- Enviar ideas o problemas por Email.
- Comentar directamente en Figma si tienes acceso.

---

## 📄 Licencia

MIT — libre de usar, mejorar y compartir citando la fuente.

---
