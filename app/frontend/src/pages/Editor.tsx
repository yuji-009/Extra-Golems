import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { generateProject } from "../api/client";
import { useState } from "react";

export default function Editor() {
  const navigate = useNavigate();
  const { project } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"items" | "armor" | "entities" | "blocks" | "recipes" | "enchantments">("items");

  if (!project) {
    navigate("/");
    return null;
  }

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const jar = await generateProject(project);
      const url = window.URL.createObjectURL(jar);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project.metadata.modId}-${project.metadata.version}.jar`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to generate mod");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const export_data = JSON.stringify(project, null, 2);
    const blob = new Blob([export_data], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.metadata.modId}-project.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.metadata.name}</h1>
            <p className="text-gray-600">Advanced Editor</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              💾 Save Project
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "📦 Generate JAR"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-lg mb-4">Content</h2>
          <nav className="space-y-2">
            {project.items.length > 0 && (
              <button
                onClick={() => setActiveTab("items")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === "items"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                ⚔️ Items ({project.items.length})
              </button>
            )}
            {project.armor.length > 0 && (
              <button
                onClick={() => setActiveTab("armor")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === "armor"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                🛡️ Armor ({project.armor.length})
              </button>
            )}
            {project.entities.length > 0 && (
              <button
                onClick={() => setActiveTab("entities")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === "entities"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                👾 Entities ({project.entities.length})
              </button>
            )}
            {project.blocks.length > 0 && (
              <button
                onClick={() => setActiveTab("blocks")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === "blocks"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                🧱 Blocks ({project.blocks.length})
              </button>
            )}
            {project.recipes.length > 0 && (
              <button
                onClick={() => setActiveTab("recipes")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === "recipes"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                🔨 Recipes ({project.recipes.length})
              </button>
            )}
            {project.enchantments.length > 0 && (
              <button
                onClick={() => setActiveTab("enchantments")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === "enchantments"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                ✨ Enchantments ({project.enchantments.length})
              </button>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className="col-span-3 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 capitalize">
            {activeTab === "items" && "⚔️ Items"}
            {activeTab === "armor" && "🛡️ Armor"}
            {activeTab === "entities" && "👾 Entities"}
            {activeTab === "blocks" && "🧱 Blocks"}
            {activeTab === "recipes" && "🔨 Recipes"}
            {activeTab === "enchantments" && "✨ Enchantments"}
          </h2>

          <div className="space-y-4">
            {activeTab === "items" &&
              project.items.map((item) => (
                <div key={item.id} className="border border-gray-300 rounded p-4">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">ID: {item.id}</p>
                  <p className="text-sm text-gray-600">Type: {item.type}</p>
                  <p className="text-sm text-gray-600">Rarity: {item.rarity}</p>
                  <p className="text-sm text-gray-600">Max Stack: {item.maxStack}</p>
                </div>
              ))}

            {activeTab === "armor" &&
              project.armor.map((armor) => (
                <div key={armor.id} className="border border-gray-300 rounded p-4">
                  <h3 className="font-bold">{armor.name}</h3>
                  <p className="text-sm text-gray-600">ID: {armor.id}</p>
                  <p className="text-sm text-gray-600">Type: {armor.type}</p>
                  <p className="text-sm text-gray-600">Protection: {armor.protection}</p>
                </div>
              ))}

            {activeTab === "entities" &&
              project.entities.map((entity) => (
                <div key={entity.id} className="border border-gray-300 rounded p-4">
                  <h3 className="font-bold">{entity.name}</h3>
                  <p className="text-sm text-gray-600">ID: {entity.id}</p>
                  <p className="text-sm text-gray-600">Type: {entity.baseType}</p>
                  <p className="text-sm text-gray-600">Health: {entity.health}</p>
                </div>
              ))}

            {activeTab === "blocks" &&
              project.blocks.map((block) => (
                <div key={block.id} className="border border-gray-300 rounded p-4">
                  <h3 className="font-bold">{block.name}</h3>
                  <p className="text-sm text-gray-600">ID: {block.id}</p>
                  <p className="text-sm text-gray-600">Type: {block.type}</p>
                  <p className="text-sm text-gray-600">Hardness: {block.hardness}</p>
                </div>
              ))}

            {activeTab === "recipes" &&
              project.recipes.map((recipe) => (
                <div key={recipe.id} className="border border-gray-300 rounded p-4">
                  <h3 className="font-bold">{recipe.name}</h3>
                  <p className="text-sm text-gray-600">ID: {recipe.id}</p>
                  <p className="text-sm text-gray-600">Type: {recipe.type}</p>
                  <p className="text-sm text-gray-600">
                    Output: {recipe.output.count}x {recipe.output.item}
                  </p>
                </div>
              ))}

            {activeTab === "enchantments" &&
              project.enchantments.map((enchantment) => (
                <div key={enchantment.id} className="border border-gray-300 rounded p-4">
                  <h3 className="font-bold">{enchantment.name}</h3>
                  <p className="text-sm text-gray-600">ID: {enchantment.id}</p>
                  <p className="text-sm text-gray-600">Max Level: {enchantment.maxLevel}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
