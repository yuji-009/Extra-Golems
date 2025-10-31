import { z } from "zod";
import type {
  Project,
  ValidationResult,
  ValidationError,
} from "../types/project";

// Zod schemas for validation
const ProjectMetadataSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Name can only contain letters, numbers, and spaces"
    ),
  modId: z
    .string()
    .min(3, "Mod ID must be at least 3 characters")
    .max(50, "Mod ID cannot exceed 50 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Mod ID must be lowercase alphanumeric with underscores only"
    ),
  version: z
    .string()
    .regex(
      /^\d+\.\d+\.\d+$/,
      "Version must follow semver format (x.y.z)"
    ),
  author: z
    .string()
    .min(1, "Author is required")
    .max(50, "Author cannot exceed 50 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  mcVersion: z.enum(["1.19.2", "1.20.1", "1.21.x"]),
});

const ItemSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-z0-9_]+$/,
      "Item ID must be lowercase alphanumeric with underscores"
    ),
  name: z
    .string()
    .min(1, "Item name is required")
    .max(50, "Item name cannot exceed 50 characters"),
  type: z.enum(["tool", "weapon", "food", "decorative"]),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
  maxStack: z
    .number()
    .min(1, "Max stack must be at least 1")
    .max(64, "Max stack cannot exceed 64"),
  texture: z.string().min(1, "Texture is required"),
  durability: z.number().min(20).max(10000).optional(),
  attackDamage: z.number().min(0).max(20).optional(),
  attackSpeed: z.number().optional(),
  customModelData: z.number().optional(),
});

const ArmorSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-z0-9_]+$/,
      "Armor ID must be lowercase alphanumeric with underscores"
    ),
  name: z
    .string()
    .min(1, "Armor name is required")
    .max(50, "Armor name cannot exceed 50 characters"),
  type: z.enum(["helmet", "chestplate", "leggings", "boots"]),
  protection: z
    .number()
    .min(0, "Protection must be at least 0")
    .max(20, "Protection cannot exceed 20"),
  toughness: z
    .number()
    .min(0, "Toughness must be at least 0")
    .max(4, "Toughness cannot exceed 4"),
  knockbackResistance: z
    .number()
    .min(0, "Knockback resistance must be at least 0")
    .max(1, "Knockback resistance cannot exceed 1"),
  durabilityMultiplier: z
    .number()
    .min(0.5, "Durability multiplier must be at least 0.5")
    .max(4.0, "Durability multiplier cannot exceed 4.0"),
  textures: z.record(z.string()),
  enchantability: z.number(),
});

const EntitySchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-z0-9_]+$/,
      "Entity ID must be lowercase alphanumeric with underscores"
    ),
  name: z
    .string()
    .min(1, "Entity name is required")
    .max(50, "Entity name cannot exceed 50 characters"),
  baseType: z.enum([
    "zombie",
    "creeper",
    "enderman",
    "custom_biped",
    "quadruped",
  ]),
  health: z
    .number()
    .min(1, "Health must be at least 1")
    .max(100, "Health cannot exceed 100"),
  attackDamage: z
    .number()
    .min(0, "Attack damage must be at least 0")
    .max(20, "Attack damage cannot exceed 20"),
  movementSpeed: z
    .number()
    .min(0.2, "Movement speed must be at least 0.2")
    .max(1.0, "Movement speed cannot exceed 1.0"),
  texture: z.string().min(1, "Texture is required"),
  model: z.string().min(1, "Model is required"),
  animations: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(["frame_based", "mcanimate"]),
        data: z.string(),
      })
    )
    .optional(),
  behaviors: z.array(
    z.enum([
      "drop_items_on_death",
      "heal_nearby",
      "explode",
      "summon_particles",
    ])
  ),
  lootDrops: z.array(
    z.object({
      item: z.string(),
      quantity: z.number().min(1),
      chance: z.number().min(0).max(1),
    })
  ),
  aiGoals: z.array(
    z.enum(["avoid_player", "attack_players", "follow_player"])
  ),
});

const BlockSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-z0-9_]+$/,
      "Block ID must be lowercase alphanumeric with underscores"
    ),
  name: z
    .string()
    .min(1, "Block name is required")
    .max(50, "Block name cannot exceed 50 characters"),
  type: z.enum(["solid", "transparent", "crop", "stairs", "slab"]),
  texture: z.string().min(1, "Texture is required"),
  hardness: z
    .number()
    .min(0.5, "Hardness must be at least 0.5")
    .max(50, "Hardness cannot exceed 50"),
  blastResistance: z
    .number()
    .min(0, "Blast resistance must be at least 0")
    .max(1000, "Blast resistance cannot exceed 1000"),
  requiresPickaxe: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        name: z.string(),
        texture: z.string(),
      })
    )
    .optional(),
  drops: z.object({
    item: z.string(),
    quantity: z.number().min(1),
    condition: z.string(),
  }),
});

const RecipeSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-z0-9_]+$/,
      "Recipe ID must be lowercase alphanumeric with underscores"
    ),
  name: z
    .string()
    .min(1, "Recipe name is required")
    .max(100, "Recipe name cannot exceed 100 characters"),
  type: z.enum(["crafting", "furnace", "smoker"]),
  ingredients: z.array(z.string()).min(1, "At least one ingredient required"),
  output: z.object({
    item: z.string(),
    count: z.number().min(1).max(64),
  }),
  pattern: z.string().optional(),
});

const EnchantmentSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-z0-9_]+$/,
      "Enchantment ID must be lowercase alphanumeric with underscores"
    ),
  name: z
    .string()
    .min(1, "Enchantment name is required")
    .max(50, "Enchantment name cannot exceed 50 characters"),
  maxLevel: z
    .number()
    .min(1, "Max level must be at least 1")
    .max(5, "Max level cannot exceed 5"),
  applicableTo: z
    .array(z.string())
    .min(1, "Must be applicable to at least one item type"),
  effect: z.string(),
});

const ProjectSchema = z.object({
  metadata: ProjectMetadataSchema,
  items: z.array(ItemSchema).optional().default([]),
  armor: z.array(ArmorSchema).optional().default([]),
  entities: z.array(EntitySchema).optional().default([]),
  blocks: z.array(BlockSchema).optional().default([]),
  recipes: z.array(RecipeSchema).optional().default([]),
  enchantments: z.array(EnchantmentSchema).optional().default([]),
});

/**
 * Validates a complete project
 */
export function validateProject(data: unknown): ValidationResult {
  try {
    ProjectSchema.parse(data);
    return {
      valid: true,
      errors: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return {
        valid: false,
        errors,
      };
    }
    return {
      valid: false,
      errors: [{ field: "unknown", message: "Validation failed" }],
    };
  }
}

/**
 * Validates just metadata
 */
export function validateMetadata(data: unknown): ValidationResult {
  try {
    ProjectMetadataSchema.parse(data);
    return {
      valid: true,
      errors: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return {
        valid: false,
        errors,
      };
    }
    return {
      valid: false,
      errors: [{ field: "unknown", message: "Validation failed" }],
    };
  }
}

/**
 * Check for ID conflicts with Minecraft items
 */
export function checkIdConflicts(project: Project): ValidationError[] {
  const errors: ValidationError[] = [];
  const reservedIds = new Set([
    "diamond",
    "gold",
    "iron",
    "wooden",
    "stone",
    "netherite",
    "emerald",
    "gold_block",
    "iron_block",
    "diamond_block",
  ]);

  // Check items
  project.items.forEach((item) => {
    if (reservedIds.has(item.id)) {
      errors.push({
        field: `items.${item.id}`,
        message: `Item ID '${item.id}' conflicts with existing mod item`,
      });
    }
  });

  // Check blocks
  project.blocks.forEach((block) => {
    if (reservedIds.has(block.id)) {
      errors.push({
        field: `blocks.${block.id}`,
        message: `Block ID '${block.id}' conflicts with existing mod item`,
      });
    }
  });

  return errors;
}
