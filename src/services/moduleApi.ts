import { Module } from './moduleManager';
import { logger } from './logger';

class ModuleApi {
  private static instance: ModuleApi;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://api.nexttech.com/modules';
  }

  public static getInstance(): ModuleApi {
    if (!ModuleApi.instance) {
      ModuleApi.instance = new ModuleApi();
    }
    return ModuleApi.instance;
  }

  public async getModules(params?: {
    category?: string;
    language?: string;
    compatibility?: string;
    minStars?: number;
    search?: string;
    sort?: string;
  }): Promise<Module[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.modules;
    } catch (error) {
      logger.error('Failed to fetch modules', { error, params });
      throw error;
    }
  }

  public async getModuleById(moduleId: string): Promise<Module> {
    try {
      const response = await fetch(`${this.baseUrl}/${moduleId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.module;
    } catch (error) {
      logger.error('Failed to fetch module', { moduleId, error });
      throw error;
    }
  }

  public async getModuleUpdates(): Promise<Module[]> {
    try {
      const response = await fetch(`${this.baseUrl}/updates`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.updates;
    } catch (error) {
      logger.error('Failed to fetch module updates', { error });
      throw error;
    }
  }

  public async getFeaturedModules(): Promise<Module[]> {
    try {
      const response = await fetch(`${this.baseUrl}/featured`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.modules;
    } catch (error) {
      logger.error('Failed to fetch featured modules', { error });
      throw error;
    }
  }

  public async getModuleStats(moduleId: string): Promise<{
    downloads: number;
    stars: number;
    forks: number;
    issues: number;
    lastUpdated: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${moduleId}/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.stats;
    } catch (error) {
      logger.error('Failed to fetch module stats', { moduleId, error });
      throw error;
    }
  }

  public async getModuleDependencies(moduleId: string): Promise<{
    dependencies: { name: string; version: string }[];
    devDependencies: { name: string; version: string }[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${moduleId}/dependencies`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.dependencies;
    } catch (error) {
      logger.error('Failed to fetch module dependencies', { moduleId, error });
      throw error;
    }
  }

  public async getModuleCompatibility(moduleId: string): Promise<{
    versions: string[];
    requirements: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${moduleId}/compatibility`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.compatibility;
    } catch (error) {
      logger.error('Failed to fetch module compatibility', { moduleId, error });
      throw error;
    }
  }
}

export const moduleApi = ModuleApi.getInstance(); 