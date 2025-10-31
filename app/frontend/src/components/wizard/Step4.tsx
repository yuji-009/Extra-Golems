import { useState } from "react";
import { useProjectStore } from "../../store/projectStore";
import { generateProject, validateProject } from "../../api/client";

export default function WizardStep4() {
  const { project } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!project) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate first
      const validation = await validateProject(project);
      if (!validation.valid) {
        setError(
          `Validation failed: ${validation.errors.map((e) => e.message).join(", ")}`
        );
        setLoading(false);
        return;
      }

      // Generate JAR
      const jar = await generateProject(project);

      // Download JAR
      const url = window.URL.createObjectURL(jar);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project.metadata.modId}-${project.metadata.version}.jar`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Review & Generate</h2>

      {/* Project Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Mod Name</h3>
          <p className="text-gray-600">{project.metadata.name}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Mod ID</h3>
          <p className="text-gray-600">{project.metadata.modId}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Version</h3>
          <p className="text-gray-600">{project.metadata.version}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Author</h3>
          <p className="text-gray-600">{project.metadata.author}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Minecraft Version</h3>
          <p className="text-gray-600">{project.metadata.mcVersion}</p>
        </div>
      </div>

      {/* Content Summary */}
      <div className="grid grid-cols-2 gap-4">
        {project.items.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-3xl mb-2">⚔️</div>
            <p className="font-semibold text-gray-800">Items</p>
            <p className="text-2xl font-bold text-blue-600">{project.items.length}</p>
          </div>
        )}
        {project.armor.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-3xl mb-2">🛡️</div>
            <p className="font-semibold text-gray-800">Armor</p>
            <p className="text-2xl font-bold text-purple-600">{project.armor.length}</p>
          </div>
        )}
        {project.entities.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-3xl mb-2">👾</div>
            <p className="font-semibold text-gray-800">Entities</p>
            <p className="text-2xl font-bold text-green-600">{project.entities.length}</p>
          </div>
        )}
        {project.blocks.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-3xl mb-2">🧱</div>
            <p className="font-semibold text-gray-800">Blocks</p>
            <p className="text-2xl font-bold text-orange-600">{project.blocks.length}</p>
          </div>
        )}
        {project.recipes.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-3xl mb-2">🔨</div>
            <p className="font-semibold text-gray-800">Recipes</p>
            <p className="text-2xl font-bold text-yellow-600">{project.recipes.length}</p>
          </div>
        )}
        {project.enchantments.length > 0 && (
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="text-3xl mb-2">✨</div>
            <p className="font-semibold text-gray-800">Enchantments</p>
            <p className="text-2xl font-bold text-pink-600">{project.enchantments.length}</p>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          <p className="font-semibold">Success! ✓</p>
          <p>Your mod JAR has been downloaded. Ready to use in Minecraft!</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Generating Mod... This may take a moment..." : "📦 Generate & Download JAR"}
      </button>
    </div>
  );
}
