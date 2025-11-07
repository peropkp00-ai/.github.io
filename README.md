# Jules API CLI

Este es un script de línea de comandos (CLI) para interactuar con la API de Jules. Permite automatizar y gestionar sesiones de desarrollo directamente desde la terminal.

## Prerrequisitos

- Node.js (versión 16 o superior)
- npm (generalmente se instala con Node.js)

## Instalación

1.  **Clonar el repositorio (si aún no lo has hecho):**
    ```bash
    git clone <URL-del-repositorio>
    cd <nombre-del-repositorio>
    ```

2.  **Instalar dependencias:**
    Desde la raíz del proyecto, ejecuta el siguiente comando para instalar `axios` y `dotenv`.
    ```bash
    npm install
    ```

3.  **Configurar la clave de API:**
    -   Crea una copia del archivo `.env.example` y renómbrala a `.env`.
        ```powershell
        # En Windows (PowerShell)
        Copy-Item .env.example .env
        ```
    -   Abre el archivo `.env` y reemplaza el texto de ejemplo con tu clave de API real de Jules.
        ```
        JULES_API_KEY="tu-clave-real-aqui"
        ```
    **Nota:** El archivo `.env` está incluido en `.gitignore`, por lo que tu clave de API no se subirá al repositorio.

## Uso

Todos los comandos se ejecutan con `node jules-cli.js` seguido del comando específico y sus argumentos.

### Comandos Disponibles

---

#### `list-sources`
Lista todos los repositorios de GitHub (fuentes) disponibles conectados a tu cuenta de Jules.

**Uso:**
```bash
node jules-cli.js list-sources
```

---

#### `get-source`
Recupera los detalles de una fuente específica por su nombre completo.

**Uso:**
```bash
node jules-cli.js get-source <source-name>
```
-   `<source-name>`: El nombre completo de la fuente (ej: "sources/github/tu-usuario/tu-repo"), obtenido del comando `list-sources`.

---

#### `create-session`
Crea una nueva sesión de trabajo con el agente de Jules.

**Uso:**
```bash
node jules-cli.js create-session "<prompt>" "<source>" "[branch]" "[titulo]"
```

**Argumentos:**
-   `<prompt>`: La instrucción inicial para el agente (ej: "Crea una app de TODOs").
-   `<source>`: El nombre de la fuente obtenido de `list-sources` (ej: "sources/github/tu-usuario/tu-repo").
-   `[branch]` (Opcional): La rama donde trabajar. Por defecto es `main`.
-   `[titulo]` (Opcional): Un título para la sesión.

**Ejemplo:**
```bash
node jules-cli.js create-session "Refactoriza el CSS para usar variables" "sources/github/peropkp00-ai/.github.io" "develop" "Refactor de CSS"
```

---

#### `list-sessions`
Muestra una lista de tus 10 sesiones más recientes.

**Uso:**
```bash
node jules-cli.js list-sessions
```

---

#### `get-session`
Recupera los detalles de una sola sesión por su ID.

**Uso:**
```bash
node jules-cli.js get-session <session-id>
```
-   `<session-id>`: El ID de la sesión, obtenido de `create-session` o `list-sessions`.

---

#### `list-activities`
Muestra las actividades (mensajes, planes, progreso) de una sesión específica.

**Uso:**
```bash
node jules-cli.js list-activities <session-id>
```
-   `<session-id>`: El ID de la sesión, obtenido de `create-session` o `list-sessions`.

---

#### `get-activity`
Recupera los detalles de una actividad específica por su nombre completo.

**Uso:**
```bash
node jules-cli.js get-activity <activity-name>
```
-   `<activity-name>`: El nombre completo de la actividad (ej: "sessions/123.../activities/abc..."), obtenido del comando `list-activities`.

---

#### `send-message`
Envía un mensaje al agente en una sesión activa.

**Uso:**
```bash
node jules-cli.js send-message <session-id> "<mensaje>"
```
-   `<session-id>`: El ID de la sesión.
-   `<mensaje>`: El mensaje o instrucción para el agente.

**Ejemplo:**
```bash
node jules-cli.js send-message "123456789" "Asegúrate de que sea compatible con todos los navegadores"
```

---

#### `approve-plan`
Aprueba el plan más reciente para una sesión que requiere aprobación explícita.

**Uso:**
```bash
node jules-cli.js approve-plan <session-id>
```
-   `<session-id>`: El ID de la sesión cuyo plan deseas aprobar.
