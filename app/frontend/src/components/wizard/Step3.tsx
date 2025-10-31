import { useState } from "react";
import { useProjectStore } from "../../store/projectStore";

interface Step3Props {
  selectedContent: {
    items: boolean;
    armor: boolean;
    entities: boolean;
    blocks: boolean;
    recipes: boolean;
    enchantments: boolean;
  };
}

export default function WizardStep3({ selectedContent }: Step3Props) {
  const { project, addItem, addArmor, addEntity, addBlock, addRecipe, addEnchantment } = useProjectStore();
  const [showItemForm, setShowItemForm] = useState(false);
  const [showArmorForm, setShowArmorForm] = useState(false);
  const [showEntityForm, setShowEntityForm] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showEnchantmentForm, setShowEnchantmentForm] = useState(false);

  if (!project) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Content Setup</h2>
      <p className="text-gray-600">
        Quick setup for your selected content types (you can add more later)
      </p>

      {selectedContent.items && (
        <ContentSection
          title="Items"
          icon="⚔️"
          count={project.items.length}
          onAdd={() => setShowItemForm(!showItemForm)}
          expanded={showItemForm}
        >
          {showItemForm && (
            <ItemForm
              onAdd={(item) => {
                addItem(item);
                setShowItemForm(false);
              }}
            />
          )}
        </ContentSection>
      )}

      {selectedContent.armor && (
        <ContentSection
          title="Armor"
          icon="🛡️"
          count={project.armor.length}
          onAdd={() => setShowArmorForm(!showArmorForm)}
          expanded={showArmorForm}
        >
          {showArmorForm && (
            <ArmorForm
              onAdd={(armor) => {
                addArmor(armor);
                setShowArmorForm(false);
              }}
            />
          )}
        </ContentSection>
      )}

      {selectedContent.entities && (
        <ContentSection
          title="Entities"
          icon="👾"
          count={project.entities.length}
          onAdd={() => setShowEntityForm(!showEntityForm)}
          expanded={showEntityForm}
        >
          {showEntityForm && (
            <EntityForm
              onAdd={(entity) => {
                addEntity(entity);
                setShowEntityForm(false);
              }}
            />
          )}
        </ContentSection>
      )}

      {selectedContent.blocks && (
        <ContentSection
          title="Blocks"
          icon="🧱"
          count={project.blocks.length}
          onAdd={() => setShowBlockForm(!showBlockForm)}
          expanded={showBlockForm}
        >
          {showBlockForm && (
            <BlockForm
              onAdd={(block) => {
                addBlock(block);
                setShowBlockForm(false);
              }}
            />
          )}
        </ContentSection>
      )}

      {selectedContent.recipes && (
        <ContentSection
          title="Recipes"
          icon="🔨"
          count={project.recipes.length}
          onAdd={() => setShowRecipeForm(!showRecipeForm)}
          expanded={showRecipeForm}
        >
          {showRecipeForm && (
            <RecipeForm
              onAdd={(recipe) => {
                addRecipe(recipe);
                setShowRecipeForm(false);
              }}
            />
          )}
        </ContentSection>
      )}

      {selectedContent.enchantments && (
        <ContentSection
          title="Enchantments"
          icon="✨"
          count={project.enchantments.length}
          onAdd={() => setShowEnchantmentForm(!showEnchantmentForm)}
          expanded={showEnchantmentForm}
        >
          {showEnchantmentForm && (
            <EnchantmentForm
              onAdd={(enchantment) => {
                addEnchantment(enchantment);
                setShowEnchantmentForm(false);
              }}
            />
          )}
        </ContentSection>
      )}
    </div>
  );
}

function ContentSection({
  title,
  icon,
  count,
  onAdd,
  expanded,
  children,
}: {
  title: string;
  icon: string;
  count: number;
  onAdd: () => void;
  expanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={onAdd}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {count}
          </span>
        </div>
        <span className={`text-2xl transition ${expanded ? "rotate-180" : ""}`}>
          ▼
        </span>
      </div>
      {expanded && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

function ItemForm({ onAdd }: { onAdd: (item: any) => void }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "decorative" as const,
    rarity: "common" as const,
    maxStack: 64,
    texture: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name) {
      onAdd(formData);
      setFormData({ id: "", name: "", type: "decorative", rarity: "common", maxStack: 64, texture: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Item ID (lowercase_underscore)"
        value={formData.id}
        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Item Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      >
        <option value="decorative">Decorative</option>
        <option value="tool">Tool</option>
        <option value="weapon">Weapon</option>
        <option value="food">Food</option>
      </select>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
      >
        Add Item
      </button>
    </form>
  );
}

function ArmorForm({ onAdd }: { onAdd: (armor: any) => void }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "helmet" as const,
    protection: 5,
    toughness: 0,
    knockbackResistance: 0,
    durabilityMultiplier: 1,
    textures: {},
    enchantability: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name) {
      onAdd(formData);
      setFormData({
        id: "",
        name: "",
        type: "helmet",
        protection: 5,
        toughness: 0,
        knockbackResistance: 0,
        durabilityMultiplier: 1,
        textures: {},
        enchantability: 10,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Armor ID"
        value={formData.id}
        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Armor Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
      >
        Add Armor
      </button>
    </form>
  );
}

function EntityForm({ onAdd }: { onAdd: (entity: any) => void }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    baseType: "zombie" as const,
    health: 20,
    attackDamage: 5,
    movementSpeed: 0.5,
    texture: "",
    model: "",
    animations: [],
    behaviors: [] as any[],
    lootDrops: [],
    aiGoals: ["attack_players" as const],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name) {
      onAdd(formData);
      setFormData({
        id: "",
        name: "",
        baseType: "zombie",
        health: 20,
        attackDamage: 5,
        movementSpeed: 0.5,
        texture: "",
        model: "",
        animations: [],
        behaviors: [],
        lootDrops: [],
        aiGoals: ["attack_players"],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Entity ID"
        value={formData.id}
        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Entity Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
      >
        Add Entity
      </button>
    </form>
  );
}

function BlockForm({ onAdd }: { onAdd: (block: any) => void }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "solid" as const,
    texture: "",
    hardness: 2,
    blastResistance: 5,
    requiresPickaxe: true,
    drops: { item: "", quantity: 1, condition: "always" },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name) {
      onAdd(formData);
      setFormData({
        id: "",
        name: "",
        type: "solid",
        texture: "",
        hardness: 2,
        blastResistance: 5,
        requiresPickaxe: true,
        drops: { item: "", quantity: 1, condition: "always" },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Block ID"
        value={formData.id}
        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Block Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
      >
        Add Block
      </button>
    </form>
  );
}

function RecipeForm({ onAdd }: { onAdd: (recipe: any) => void }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "crafting" as const,
    ingredients: [],
    output: { item: "", count: 1 },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name) {
      onAdd(formData);
      setFormData({ id: "", name: "", type: "crafting", ingredients: [], output: { item: "", count: 1 } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Recipe ID"
        value={formData.id}
        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Recipe Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
      >
        Add Recipe
      </button>
    </form>
  );
}

function EnchantmentForm({ onAdd }: { onAdd: (enchantment: any) => void }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    maxLevel: 1,
    applicableTo: ["sword"],
    effect: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name) {
      onAdd(formData);
      setFormData({ id: "", name: "", maxLevel: 1, applicableTo: ["sword"], effect: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Enchantment ID"
        value={formData.id}
        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Enchantment Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
      >
        Add Enchantment
      </button>
    </form>
  );
}
