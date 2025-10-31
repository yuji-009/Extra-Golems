import Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import type { Project } from "../types/project";
import type { GeneratedFile } from "../types/generated";

export class CodeGenerator {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    const templatesDir = path.join(__dirname, "../templates");

    // Load all .hbs files
    const files = [
      "item.java.hbs",
      "entity.java.hbs",
      "block.java.hbs",
      "modmain.java.hbs",
      "build.gradle.hbs",
      "fabric.mod.json.hbs",
      "en_us.json.hbs",
    ];

    files.forEach((file) => {
      const templatePath = path.join(templatesDir, file);
      if (fs.existsSync(templatePath)) {
        const content = fs.readFileSync(templatePath, "utf-8");
        const template = Handlebars.compile(content);
        this.templates.set(file.replace(".hbs", ""), template);
      }
    });

    // Register Handlebars helpers
    Handlebars.registerHelper("upper", (text: string) => text?.toUpperCase());
    Handlebars.registerHelper("lower", (text: string) =>
      text?.toLowerCase()
    );
    Handlebars.registerHelper("capitalize", (text: string) => {
      if (!text) return "";
      return text.charAt(0).toUpperCase() + text.slice(1);
    });
  }

  /**
   * Generate all files for a mod
   */
  public generateMod(project: Project): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    const { metadata } = project;

    // Generate main mod class
    files.push({
      path: `src/main/java/com/${metadata.author}/${metadata.modId}/${this.toPascalCase(metadata.modId)}Mod.java`,
      content: this.generateFile("modmain.java", {
        ...metadata,
        author: metadata.author.toLowerCase().replace(/\s+/g, ""),
        modNameCamel: this.toPascalCase(metadata.modId),
        modName: metadata.name,
      }),
    });

    // Generate items
    project.items.forEach((item) => {
      files.push({
        path: `src/main/java/com/${metadata.author}/${metadata.modId}/item/${this.toPascalCase(item.id)}Item.java`,
        content: this.generateFile("item.java", {
          author: metadata.author.toLowerCase().replace(/\s+/g, ""),
          modId: metadata.modId,
          className: `${this.toPascalCase(item.id)}Item`,
          ...item,
          rarityUpper: item.rarity.toUpperCase(),
        }),
      });
    });

    // Generate entities
    project.entities.forEach((entity) => {
      files.push({
        path: `src/main/java/com/${metadata.author}/${metadata.modId}/entity/${this.toPascalCase(entity.id)}Entity.java`,
        content: this.generateFile("entity.java", {
          author: metadata.author.toLowerCase().replace(/\s+/g, ""),
          modId: metadata.modId,
          className: `${this.toPascalCase(entity.id)}Entity`,
          ...entity,
        }),
      });
    });

    // Generate blocks
    project.blocks.forEach((block) => {
      files.push({
        path: `src/main/java/com/${metadata.author}/${metadata.modId}/block/${this.toPascalCase(block.id)}Block.java`,
        content: this.generateFile("block.java", {
          author: metadata.author.toLowerCase().replace(/\s+/g, ""),
          modId: metadata.modId,
          className: `${this.toPascalCase(block.id)}Block`,
          ...block,
        }),
      });
    });

    // Generate build.gradle
    const mcVersionConditions = {
      mcVersion1192: metadata.mcVersion === "1.19.2",
      mcVersion1201: metadata.mcVersion === "1.20.1",
      mcVersion121x: metadata.mcVersion === "1.21.x",
    };

    files.push({
      path: "build.gradle",
      content: this.generateFile("build.gradle", {
        ...metadata,
        ...mcVersionConditions,
      }),
    });

    // Generate fabric.mod.json
    files.push({
      path: "src/main/resources/fabric.mod.json",
      content: this.generateFile("fabric.mod.json", {
        ...metadata,
        modNameCamel: this.toPascalCase(metadata.modId),
        author: metadata.author,
      }),
    });

    // Generate language file
    files.push({
      path: "src/main/resources/assets/" + metadata.modId + "/lang/en_us.json",
      content: this.generateFile("en_us.json", {
        modId: metadata.modId,
        items: project.items,
        armor: project.armor,
        blocks: project.blocks,
        entities: project.entities,
        enchantments: project.enchantments,
      }),
    });

    // Generate settings.gradle
    files.push({
      path: "settings.gradle",
      content: `rootProject.name = '${metadata.modId}'`,
    });

    // Generate gradle wrapper files
    files.push({
      path: "gradle/wrapper/gradle-wrapper.properties",
      content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.3-bin.zip
networkTimeout=10000
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`,
    });

    // Generate gradle.properties
    files.push({
      path: "gradle.properties",
      content: `org.gradle.jvmargs=-Xmx1G
org.gradle.parallel=true
minecraft_version=${this.getMinecraftVersion(metadata.mcVersion)}
yarn_mappings=${this.getYarnMappings(metadata.mcVersion)}
loader_version=${this.getLoaderVersion(metadata.mcVersion)}
mod_version=${metadata.version}
maven_group=com.${metadata.author.toLowerCase().replace(/\s+/g, "")}.${metadata.modId}
archives_base_name=${metadata.modId}`,
    });

    // Generate .gitignore
    files.push({
      path: ".gitignore",
      content: `# gradle
.gradle/
build/
out/
classes/

# idea
.idea/
*.iml
*.iws
*.ipr

# mac
.DS_Store

# vscode
.vscode/
.classpath
.project
.settings/
bin/`,
    });

    // Generate README
    files.push({
      path: "README.md",
      content: `# ${metadata.name}

Version: ${metadata.version}
Author: ${metadata.author}
Minecraft Version: ${metadata.mcVersion}

${metadata.description || ""}

## Building

Run the following command to build the mod:

\`\`\`bash
./gradlew build
\`\`\`

The built JAR will be in \`build/libs/\`.`,
    });

    return files;
  }

  /**
   * Generate a single file from a template
   */
  private generateFile(
    templateName: string,
    context: Record<string, unknown>
  ): string {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }
    return template(context);
  }

  /**
   * Convert snake_case to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }

  /**
   * Get Minecraft version number
   */
  private getMinecraftVersion(version: string): string {
    switch (version) {
      case "1.19.2":
        return "1.19.2";
      case "1.20.1":
        return "1.20.1";
      case "1.21.x":
        return "1.21";
      default:
        return "1.20.1";
    }
  }

  /**
   * Get Yarn mappings version
   */
  private getYarnMappings(version: string): string {
    switch (version) {
      case "1.19.2":
        return "1.19.2+build.28";
      case "1.20.1":
        return "1.20.1+build.10";
      case "1.21.x":
        return "1.21+build.3";
      default:
        return "1.20.1+build.10";
    }
  }

  /**
   * Get Fabric Loader version
   */
  private getLoaderVersion(version: string): string {
    switch (version) {
      case "1.19.2":
        return "0.14.21";
      case "1.20.1":
        return "0.14.21";
      case "1.21.x":
        return "0.15.0";
      default:
        return "0.14.21";
    }
  }
}
