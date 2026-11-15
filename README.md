# VaultDeck

Aplicación web full-stack para la gestión y creación de mazos de **Magic: The Gathering (MTG)**, con búsqueda en tiempo real integrada a la API de Scryfall y validación de reglas del formato Commander.

---

## Funcionalidades

- **Búsqueda en tiempo real**: Consulta de cartas instantánea conectada directamente a la [API de Scryfall](https://scryfall.com/docs/api).
- **Gestor de Mazos Commander**: 
  - Selección de Comandante integrada.
  - Validación automática de identidad de color.
  - Control de límite de cartas (100 cartas) y restricciones de copias.

---

## Tecnologías Utilizadas

### Frontend
- **React** (Vite)
- **CSS Modules / Estilos personalizados**

### Backend
- **Python / Django**
- **Django REST Framework (DRF)**
- **SQLite**

---

## Guía de Instalación y Configuración Local


### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/vaultdeck.git](https://github.com/tu-usuario/vaultdeck.git)
cd vaultdeck
```
### 2. Configurar el Backend (Django)
```
# Entrar a la carpeta del backend
cd backend

# Crear y activar un entorno virtual
python -m venv venv
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Realizar migraciones de la base de datos
python manage.py makemigrations
python manage.py migrate

# Iniciar el servidor backend
python manage.py runserver
```
### 3. Configurar el Frontend (React)
Abre una nueva terminal, entra a la carpeta raíz del proyecto y ejecuta:

```
# Instalar dependencias del frontend
npm install

# Iniciar el servidor de desarrollo
npm run dev
```
## Estructura del Proyecto

```text
vaultdeck/
├── backend/            # Código de Django (API REST)
│   ├── mazos/          # App principal (Modelos, Vistas, Serializadores)
│   └── manage.py
│
├── src/                # Código de React (Frontend)
│   ├── api/            # Conexiones con Scryfall y backend
│   ├── components/     # Componentes (DetalleMazo, BuscadorCartas, FormularioMazo, etc.)
│   └── App.jsx
│
└── README.md
