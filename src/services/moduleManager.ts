import { logger } from './logger';
import { cache } from './cache';

interface Module {
  id: string;
  name: string;
  version: string;
  dependencies: string[];
  installed: boolean;
  enabled: boolean;
  config: Record<string, unknown>;
}

interface ModuleMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  repository: string;
  dependencies: string[];
  compatibility: string[];
  size: string;
  lastUpdated: string;
}

class ModuleManager {
  private static instance: ModuleManager;
  private modules: Map<string, Module> = new Map();
  private readonly CACHE_KEY = 'installed_modules';
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.loadInstalledModules();
  }

  static getInstance(): ModuleManager {
    if (!ModuleManager.instance) {
      ModuleManager.instance = new ModuleManager();
    }
    return ModuleManager.instance;
  }

  private loadInstalledModules(): void {
    try {
      const cachedModules = cache.get<Module[]>(this.CACHE_KEY);
      if (cachedModules) {
        cachedModules.forEach(module => {
          this.modules.set(module.id, module);
        });
      }
    } catch (error) {
      logger.error('Failed to load installed modules', { error });
    }
  }

  private saveInstalledModules(): void {
    try {
      const modules = Array.from(this.modules.values());
      cache.set(this.CACHE_KEY, modules, this.CACHE_TTL);
    } catch (error) {
      logger.error('Failed to save installed modules', { error });
    }
  }

  async installModule(moduleId: string, metadata: ModuleMetadata): Promise<void> {
    try {
      // Check dependencies
      await this.checkDependencies(metadata.dependencies);

      // Download module
      await this.downloadModule(moduleId, metadata);

      // Install module
      const module: Module = {
        id: moduleId,
        name: metadata.name,
        version: metadata.version,
        dependencies: metadata.dependencies,
        installed: true,
        enabled: true,
        config: {}
      };

      this.modules.set(moduleId, module);
      this.saveInstalledModules();

      logger.info('Module installed successfully', { moduleId, version: metadata.version });
    } catch (error) {
      logger.error('Failed to install module', { moduleId, error });
      throw error;
    }
  }

  async uninstallModule(moduleId: string): Promise<void> {
    try {
      const module = this.modules.get(moduleId);
      if (!module) {
        throw new Error(`Module ${moduleId} not found`);
      }

      // Disable module first
      await this.disableModule(moduleId);

      // Remove module files
      await this.removeModuleFiles(moduleId);

      // Remove from installed modules
      this.modules.delete(moduleId);
      this.saveInstalledModules();

      logger.info('Module uninstalled successfully', { moduleId });
    } catch (error) {
      logger.error('Failed to uninstall module', { moduleId, error });
      throw error;
    }
  }

  async enableModule(moduleId: string): Promise<void> {
    try {
      const module = this.modules.get(moduleId);
      if (!module) {
        throw new Error(`Module ${moduleId} not found`);
      }

      module.enabled = true;
      this.modules.set(moduleId, module);
      this.saveInstalledModules();

      logger.info('Module enabled successfully', { moduleId });
    } catch (error) {
      logger.error('Failed to enable module', { moduleId, error });
      throw error;
    }
  }

  async disableModule(moduleId: string): Promise<void> {
    try {
      const module = this.modules.get(moduleId);
      if (!module) {
        throw new Error(`Module ${moduleId} not found`);
      }

      module.enabled = false;
      this.modules.set(moduleId, module);
      this.saveInstalledModules();

      logger.info('Module disabled successfully', { moduleId });
    } catch (error) {
      logger.error('Failed to disable module', { moduleId, error });
      throw error;
    }
  }

  async updateModule(moduleId: string, newVersion: string): Promise<void> {
    try {
      const module = this.modules.get(moduleId);
      if (!module) {
        throw new Error(`Module ${moduleId} not found`);
      }

      // Download new version
      const metadata = await this.fetchModuleMetadata(moduleId);
      if (metadata.version === newVersion) {
        return;
      }

      // Backup current version
      await this.backupModule(moduleId);

      // Install new version
      await this.installModule(moduleId, metadata);

      logger.info('Module updated successfully', { moduleId, version: newVersion });
    } catch (error) {
      logger.error('Failed to update module', { moduleId, error });
      throw error;
    }
  }

  getInstalledModules(): Module[] {
    return Array.from(this.modules.values());
  }

  getModule(moduleId: string): Module | undefined {
    return this.modules.get(moduleId);
  }

  private async checkDependencies(dependencies: string[]): Promise<void> {
    for (const dep of dependencies) {
      const module = this.modules.get(dep);
      if (!module || !module.enabled) {
        throw new Error(`Dependency ${dep} not installed or enabled`);
      }
    }
  }

  private async downloadModule(moduleId: string, metadata: ModuleMetadata): Promise<void> {
    // Implement module download logic
    // This would typically involve fetching from a CDN or repository
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async removeModuleFiles(moduleId: string): Promise<void> {
    // Implement module file removal logic
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async backupModule(moduleId: string): Promise<void> {
    // Implement module backup logic
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async fetchModuleMetadata(moduleId: string): Promise<ModuleMetadata> {
    // Implement module metadata fetching logic
    // This would typically involve fetching from a registry
    return {
      id: moduleId,
      name: 'Test Module',
      version: '1.0.0',
      description: 'Test module description',
      author: 'Test Author',
      repository: 'https://github.com/test/module',
      dependencies: [],
      compatibility: ['v1.0.0+'],
      size: '1MB',
      lastUpdated: new Date().toISOString()
    };
  }
}

export const moduleManager = ModuleManager.getInstance(); 