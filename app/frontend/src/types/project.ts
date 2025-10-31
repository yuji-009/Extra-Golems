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
  name: string;
  modId: string;
  version: string;
  author: string;
  description?: string;
  mcVersion: McVersion;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  maxStack: number;
  texture: string;
  durability?: number;
  attackDamage?: number;
  attackSpeed?: number;
  customModelData?: number;
}

export interface Armor {
  id: string;
  name: string;
  type: ArmorType;
  protection: number;
  toughness: number;
  knockbackResistance: number;
  durabilityMultiplier: number;
  textures: Record<string, string>;
  enchantability: number;
}

export interface Animation {
  name: string;
  type: "frame_based" | "mcanimate";
  data: string;
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
  health: number;
  attackDamage: number;
  movementSpeed: number;
  texture: string;
  model: string;
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
  texture: string;
  hardness: number;
  blastResistance: number;
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
  ingredients: string[];
  output: {
    item: string;
    count: number;
  };
  pattern?: string;
}

export interface Enchantment {
  id: string;
  name: string;
  maxLevel: number;
  applicableTo: string[];
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

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
