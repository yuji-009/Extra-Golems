import { useProjectStore } from "../../store/projectStore";
import type { McVersion } from "../../types/project";

export default function WizardStep1() {
  const { project, updateMetadata } = useProjectStore();

  if (!project) return null;

  const { metadata } = project;

  const handleModIdChange = (value: string) => {
    const modId = value.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    updateMetadata({ modId });
  };

  const generateModId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  const handleNameChange = (value: string) => {
    updateMetadata({
      name: value,
      modId: generateModId(value),
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Mod Basics</h2>
      <p className="text-gray-600">
        Start by providing basic information about your mod
      </p>

      <div className="space-y-4">
        {/* Mod Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mod Name *
          </label>
          <input
            type="text"
            value={metadata.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., Cool Gems Mod"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            {metadata.name.length}/50 characters
          </p>
        </div>

        {/* Mod ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mod ID (unique identifier) *
          </label>
          <input
            type="text"
            value={metadata.modId}
            onChange={(e) => handleModIdChange(e.target.value)}
            placeholder="e.g., cool_gems"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            Lowercase letters, numbers, and underscores only
          </p>
        </div>

        {/* Version */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Version *
          </label>
          <input
            type="text"
            value={metadata.version}
            onChange={(e) => updateMetadata({ version: e.target.value })}
            placeholder="1.0.0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Format: x.y.z (semver)</p>
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author Name *
          </label>
          <input
            type="text"
            value={metadata.author}
            onChange={(e) => updateMetadata({ author: e.target.value })}
            placeholder="Your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={50}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={metadata.description || ""}
            onChange={(e) => updateMetadata({ description: e.target.value })}
            placeholder="Describe what your mod does..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {(metadata.description || "").length}/500 characters
          </p>
        </div>

        {/* Minecraft Version */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Minecraft Version *
          </label>
          <select
            value={metadata.mcVersion}
            onChange={(e) =>
              updateMetadata({ mcVersion: e.target.value as McVersion })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1.19.2">1.19.2</option>
            <option value="1.20.1">1.20.1</option>
            <option value="1.21.x">1.21.x</option>
          </select>
        </div>
      </div>
    </div>
  );
}
