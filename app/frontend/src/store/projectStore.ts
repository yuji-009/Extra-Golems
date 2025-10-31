import { create } from "zustand";
import type { Project, ProjectMetadata } from "../types/project";

interface ProjectStore {
  project: Project | null;
  setProject: (project: Project) => void;
  updateMetadata: (metadata: Partial<ProjectMetadata>) => void;
  addItem: (item: any) => void;
  updateItem: (id: string, item: any) => void;
  deleteItem: (id: string) => void;
  addArmor: (armor: any) => void;
  updateArmor: (id: string, armor: any) => void;
  deleteArmor: (id: string) => void;
  addEntity: (entity: any) => void;
  updateEntity: (id: string, entity: any) => void;
  deleteEntity: (id: string) => void;
  addBlock: (block: any) => void;
  updateBlock: (id: string, block: any) => void;
  deleteBlock: (id: string) => void;
  addRecipe: (recipe: any) => void;
  updateRecipe: (id: string, recipe: any) => void;
  deleteRecipe: (id: string) => void;
  addEnchantment: (enchantment: any) => void;
  updateEnchantment: (id: string, enchantment: any) => void;
  deleteEnchantment: (id: string) => void;
  reset: () => void;
}

const createEmptyProject = (): Project => ({
  metadata: {
    name: "New Mod",
    modId: "newmod",
    version: "1.0.0",
    author: "ModAuthor",
    description: "",
    mcVersion: "1.20.1",
  },
  items: [],
  armor: [],
  entities: [],
  blocks: [],
  recipes: [],
  enchantments: [],
});

export const useProjectStore = create<ProjectStore>((set) => ({
  project: createEmptyProject(),

  setProject: (project: Project) => set({ project }),

  updateMetadata: (metadata: Partial<ProjectMetadata>) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          metadata: { ...state.project.metadata, ...metadata },
        },
      };
    }),

  addItem: (item: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          items: [...state.project.items, item],
        },
      };
    }),

  updateItem: (id: string, item: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          items: state.project.items.map((i) => (i.id === id ? item : i)),
        },
      };
    }),

  deleteItem: (id: string) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          items: state.project.items.filter((i) => i.id !== id),
        },
      };
    }),

  addArmor: (armor: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          armor: [...state.project.armor, armor],
        },
      };
    }),

  updateArmor: (id: string, armor: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          armor: state.project.armor.map((a) => (a.id === id ? armor : a)),
        },
      };
    }),

  deleteArmor: (id: string) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          armor: state.project.armor.filter((a) => a.id !== id),
        },
      };
    }),

  addEntity: (entity: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          entities: [...state.project.entities, entity],
        },
      };
    }),

  updateEntity: (id: string, entity: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          entities: state.project.entities.map((e) =>
            e.id === id ? entity : e
          ),
        },
      };
    }),

  deleteEntity: (id: string) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          entities: state.project.entities.filter((e) => e.id !== id),
        },
      };
    }),

  addBlock: (block: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          blocks: [...state.project.blocks, block],
        },
      };
    }),

  updateBlock: (id: string, block: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          blocks: state.project.blocks.map((b) => (b.id === id ? block : b)),
        },
      };
    }),

  deleteBlock: (id: string) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          blocks: state.project.blocks.filter((b) => b.id !== id),
        },
      };
    }),

  addRecipe: (recipe: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          recipes: [...state.project.recipes, recipe],
        },
      };
    }),

  updateRecipe: (id: string, recipe: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          recipes: state.project.recipes.map((r) =>
            r.id === id ? recipe : r
          ),
        },
      };
    }),

  deleteRecipe: (id: string) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          recipes: state.project.recipes.filter((r) => r.id !== id),
        },
      };
    }),

  addEnchantment: (enchantment: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          enchantments: [...state.project.enchantments, enchantment],
        },
      };
    }),

  updateEnchantment: (id: string, enchantment: any) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          enchantments: state.project.enchantments.map((e) =>
            e.id === id ? enchantment : e
          ),
        },
      };
    }),

  deleteEnchantment: (id: string) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          enchantments: state.project.enchantments.filter(
            (e) => e.id !== id
          ),
        },
      };
    }),

  reset: () => set({ project: createEmptyProject() }),
}));
