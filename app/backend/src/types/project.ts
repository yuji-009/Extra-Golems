// Project data types matching planning.md specification

export type McVersion = "1.19.2" | "1.20.1" | "1.21.x";
export type ItemType = "tool" | "weapon" | "food" | "decorative";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ArmorType = "helmet" | "chestplate" | "leggings" | "boots";
export type EntityBaseType = "zombie" | "creeper" | "enderman" | "custom_biped" | "quadruped";
export type Behavior = "drop_items_on_death" | "heal_nearby" | "explode" | "summon_particles";
export type BlockType = "solid" | "transparent" | "crop" | "stairs" | "slab";
export type RecipeType = "crafting" | "furnace" | "smoker";
export type AiGoal = "avoid_player" | "attack_players" | "follow_player";

export interface ProjectMetadata {
  name: string; // 3-50 alphanumeric + spaces
  modId: string; // lowercase_underscore, unique
  version: string; // semver format
  author: string;
  description?: string;
  mcVersion: McVersion;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  maxStack: number; // 1-64
  texture: string; // base64 or URL
  durability?: number; // if tool/weapon
  attackDamage?: number; // if weapon
  attackSpeed?: number; // if weapon, default 4.0
  customModelData?: number;
}

export interface Armor {
  id: string;
  name: string;
  type: ArmorType;
  protection: number; // 0-20
  toughness: number; // 0-4
  knockbackResistance: number; // 0-1
  durabilityMultiplier: number; // 0.5-4.0
  textures: Record<string, string>; // base64 or URL
  enchantability: number;
}

export interface Animation {
  name: string;
  type: "frame_based" | "mcanimate";
  data: string; // animation definition
}

export interface LootDrop {
  item: string;
  quantity: number;
  chance: number;
}

export interface Entity {
  id: string;
  name: string;
  baseType: EntityBaseType;
  health: number; // 1-100
  attackDamage: number; // 0-20
  movementSpeed: number; // 0.2-1.0
  texture: string; // base64 or URL
  model: string; // blockbench JSON or native
  animations?: Animation[];
  behaviors: Behavior[];
  lootDrops: LootDrop[];
  aiGoals: AiGoal[];
}

export interface BlockVariant {
  name: string;
  texture: string;
}

export interface Block {
  id: string;
  name: string;
  type: BlockType;
  texture: string; // base64 or URL
  hardness: number; // 0.5-50
  blastResistance: number; // 0-1000
  requiresPickaxe?: boolean;
  variants?: BlockVariant[];
  drops: {
    item: string;
    quantity: number;
    condition: string;
  };
}

export interface Recipe {
  id: string;
  name: string;
  type: RecipeType;
  ingredients: string[]; // item IDs
  output: {
    item: string;
    count: number;
  };
  pattern?: string; // for shaped crafting
}

export interface Enchantment {
  id: string;
  name: string;
  maxLevel: number; // 1-5
  applicableTo: string[]; // item types
  effect: string;
}

export interface Project {
  metadata: ProjectMetadata;
  items: Item[];
  armor: Armor[];
  entities: Entity[];
  blocks: Block[];
  recipes: Recipe[];
  enchantments: Enchantment[];
}

export interface ProjectExport extends Project {
  version: string;
  exported_at: string;
  textures: Record<string, string>; // base64 encoded textures
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface TextureUploadResponse {
  textureUrl: string;
  size: string;
  checksum: string;
}

export interface ModelUploadResponse {
  modelUrl: string;
  bones: number;
  preview: string;
}

export interface AITextureResponse {
  textureUrl: string;
}

export interface GenerateResponse {
  success: boolean;
  jarUrl?: string;
  error?: string;
}
