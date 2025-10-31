# Minecraft Mod Generator

A comprehensive web application that enables users to create fully functional Minecraft mods from zero without coding knowledge. The app generates complete, compilable JAR files supporting items, armor, textures, animations, entities, and more.

## Features

- ✨ **No Coding Required** - Create mods through an intuitive UI
- ⚔️ **Custom Items** - Tools, weapons, food, decorative items
- 🛡️ **Armor Sets** - Full armor customization with durability and enchantability
- 👾 **Entities/Mobs** - Custom mobs with AI behaviors and animations
- 🧱 **Blocks** - Create decorative and functional blocks
- 🍳 **Recipes** - Crafting, furnace, and smoker recipes
- 🎨 **Textures** - Upload custom PNG textures
- ✨ **Enchantments** - Create custom enchantments
- 📦 **JAR Generation** - Instant compilation to ready-to-use JAR files
- 💾 **Project Management** - Save and import projects

## Quick Start

### Prerequisites

- Node.js 18+
- Docker (optional, for containerized deployment)
- Java 17+ (for local Gradle builds)

### Installation

1. **Install dependencies:**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Configure environment (optional):**

Create `.env` in the backend directory:
```
PORT=3001
NODE_ENV=development
```

### Running Locally

#### Without Docker

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

#### With Docker

```bash
cd docker
docker-compose up
```

The app will be available at `http://localhost:3000`

## Usage

### Creating a Mod

1. **Click "Create New Mod"** on the home page
2. **Step 1: Mod Basics** - Enter mod name, ID, version, author, and target Minecraft version
3. **Step 2: Content Selection** - Choose which content types to include
4. **Step 3: Content Setup** - Add items, entities, blocks, etc.
5. **Step 4: Review & Generate** - Review your mod and download the JAR

### Importing a Project

1. Click "Import Project" on the home page
2. Select a previously exported `.json` project file
3. Edit in the advanced editor or generate immediately

### Advanced Editing

Use the Advanced Editor to:
- Edit individual items, entities, blocks, etc.
- Manage textures and models
- Preview your mod configuration
- Generate new JAR files

## Project Structure

```
app/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express server
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── validators/            # Input validation
│   │   ├── templates/             # Code generation templates
│   │   └── types/                 # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/                 # Page components
│   │   ├── components/            # Reusable components
│   │   ├── store/                 # State management
│   │   ├── api/                   # API client
│   │   ├── types/                 # TypeScript types
│   │   └── App.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── docker/
    ├── Dockerfile
    ├── Dockerfile.backend
    ├── Dockerfile.frontend
    └── docker-compose.yml
```

## API Endpoints

### Projects
- `POST /api/projects/generate` - Generate JAR from project data
- `POST /api/projects/validate` - Validate project configuration
- `POST /api/projects/import` - Import project file

### Textures
- `POST /api/textures/upload` - Upload texture PNG
- `POST /api/textures/generate` - Generate texture with AI (future)

### Models
- `POST /api/models/upload` - Upload Blockbench model
- `POST /api/models/parse-json` - Validate model JSON

## Technology Stack

### Frontend
- React 18+ with TypeScript
- Vite for fast development
- TailwindCSS for styling
- Zustand for state management
- React Router for navigation
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript for type safety
- Zod for validation
- Handlebars for code templating
- Sharp for image processing
- Gradle for mod compilation

## Supported Minecraft Versions

- 1.19.2 (Fabric)
- 1.20.1 (Fabric)
- 1.21.x (Fabric)

## Data Model

### Project Structure

```json
{
  "metadata": {
    "name": "Cool Gems Mod",
    "modId": "cool_gems",
    "version": "1.0.0",
    "author": "ModAuthor",
    "description": "Adds cool gem items",
    "mcVersion": "1.20.1"
  },
  "items": [
    {
      "id": "ruby",
      "name": "Ruby",
      "type": "decorative",
      "rarity": "rare",
      "maxStack": 64,
      "texture": "data:image/png;base64,..."
    }
  ],
  "armor": [],
  "entities": [],
  "blocks": [],
  "recipes": [],
  "enchantments": []
}
```

## Validation Rules

**Metadata:**
- Name: 3-50 characters, alphanumeric + spaces
- Mod ID: unique, lowercase with underscores only
- Version: semver format (x.y.z)
- Author: 1-50 characters
- Description: max 500 characters

**Items:**
- ID: unique, lowercase_underscore
- Max Stack: 1-64
- Durability: 20-10000 (if tool/weapon)
- Attack Damage: 0-20 (if weapon)

**Armor:**
- Protection: 0-20
- Toughness: 0-4
- Durability Multiplier: 0.5-4.0

**Entities:**
- Health: 1-100
- Attack Damage: 0-20
- Movement Speed: 0.2-1.0

**Blocks:**
- Hardness: 0.5-50
- Blast Resistance: 0-1000

**Recipes:**
- Output Quantity: 1-64
- Must reference valid items

**Enchantments:**
- Max Level: 1-5
- Must have applicable item types

## Build Process

When you click "Generate & Download JAR", the application:

1. Validates your project data
2. Generates Java source files from templates
3. Creates Gradle configuration files
4. Runs `gradle build` to compile the mod
5. Returns the JAR file for download
6. The JAR is ready to place in your Minecraft mods folder

## Error Handling

The application provides detailed error messages for:
- Validation errors (invalid inputs)
- ID conflicts (duplicate item/block IDs)
- Build failures (compilation errors)
- File upload issues (wrong format, size exceeded)

## Future Enhancements

- 3D model viewer for entities and blocks
- AI texture generation (DALL-E integration)
- Blockbench model import
- Animation support
- Sound effect integration
- Mod dependencies and configuration
- CurseForge integration for mod distribution

## Contributing

This project demonstrates a complete mod generation system. Feel free to:
- Extend with more content types
- Improve code generation templates
- Add more Minecraft versions
- Optimize build performance

## Support

For issues or questions:
1. Check the built-in help documentation
2. Review the planning.md file for feature specifications
3. Check the research.md for implementation details

## License

MIT

## Disclaimer

This tool generates Minecraft mods for use with Fabric mod loader. Ensure you have the appropriate rights to create and distribute mods. Always test mods in a Minecraft instance before distribution.
