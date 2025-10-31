interface Step2Props {
  selectedContent: {
    items: boolean;
    armor: boolean;
    entities: boolean;
    blocks: boolean;
    recipes: boolean;
    enchantments: boolean;
  };
  onSelectionChange: (
    content: typeof selectedContent
  ) => void;
}

const contentTypes = [
  { key: "items", label: "Custom Items", icon: "⚔️", description: "Tools, weapons, food & decorative items" },
  { key: "armor", label: "Armor Sets", icon: "🛡️", description: "Full armor with durability & enchantability" },
  { key: "entities", label: "Entities/Mobs", icon: "👾", description: "Custom mobs with behaviors & AI" },
  { key: "blocks", label: "Blocks", icon: "🧱", description: "Solid & decorative blocks" },
  { key: "recipes", label: "Recipes", icon: "🔨", description: "Crafting, furnace & smoker recipes" },
  { key: "enchantments", label: "Enchantments", icon: "✨", description: "Custom enchantments for items" },
] as const;

export default function WizardStep2({ selectedContent, onSelectionChange }: Step2Props) {
  const handleToggle = (key: keyof typeof selectedContent) => {
    onSelectionChange({
      ...selectedContent,
      [key]: !selectedContent[key],
    });
  };

  const countSelected = Object.values(selectedContent).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Content Selection</h2>
      <p className="text-gray-600">
        Choose which types of content to include in your mod
      </p>

      <div className="space-y-3">
        {contentTypes.map(({ key, label, icon, description }) => (
          <label
            key={key}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition"
          >
            <input
              type="checkbox"
              checked={selectedContent[key]}
              onChange={() => handleToggle(key)}
              className="w-5 h-5 rounded border-gray-300"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-semibold text-gray-800">{label}</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            {selectedContent[key] && (
              <span className="text-blue-600 font-bold">✓</span>
            )}
          </label>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Selected:</strong> {countSelected} content type{countSelected !== 1 ? "s" : ""}
          {countSelected === 0 && " (select at least one)"}
        </p>
      </div>
    </div>
  );
}
