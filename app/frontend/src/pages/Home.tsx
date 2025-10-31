import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useProjectStore } from "../store/projectStore";
import { importProject } from "../api/client";

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setProject, reset } = useProjectStore();

  const handleNewMod = () => {
    reset();
    navigate("/wizard");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const project = await importProject(file);
      setProject(project);
      navigate("/editor");
    } catch (error) {
      alert("Failed to import project");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Minecraft Mod Generator</h1>
          <p className="text-xl mb-12 text-blue-100">
            Create fully functional Minecraft mods without coding. Add items,
            armor, entities, blocks, and more.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <button
              onClick={handleNewMod}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition shadow-lg"
            >
              ✨ Create New Mod
            </button>
            <button
              onClick={handleImportClick}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition shadow-lg"
            >
              📂 Import Project
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-8 text-left">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚔️</span>
                <div>
                  <h3 className="font-semibold">Custom Items</h3>
                  <p className="text-blue-100">Tools, weapons, food & more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="font-semibold">Armor Sets</h3>
                  <p className="text-blue-100">Full armor customization</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">👾</span>
                <div>
                  <h3 className="font-semibold">Entities</h3>
                  <p className="text-blue-100">Custom mobs with behaviors</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧱</span>
                <div>
                  <h3 className="font-semibold">Blocks</h3>
                  <p className="text-blue-100">Decorative and functional</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-semibold">Textures</h3>
                  <p className="text-blue-100">Upload custom PNGs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h3 className="font-semibold">Build & Export</h3>
                  <p className="text-blue-100">Instant JAR generation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
