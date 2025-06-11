import { Module } from './moduleManager';
import { logger } from './logger';

class ModuleService {
  private static instance: ModuleService;
  private installedModules: Map<string, Module> = new Map();

  private constructor() {
    this.loadInstalledModules();
  }

  public static getInstance(): ModuleService {
    if (!ModuleService.instance) {
      ModuleService.instance = new ModuleService();
    }
    return ModuleService.instance;
  }

  private async loadInstalledModules() {
    try {
      const modules = localStorage.getItem('installedModules');
      if (modules) {
        const parsedModules = JSON.parse(modules);
        this.installedModules = new Map(Object.entries(parsedModules));
      }
    } catch (error) {
      logger.error('Failed to load installed modules', { error });
    }
  }

  private async saveInstalledModules() {
    try {
      const modules = Object.fromEntries(this.installedModules);
      localStorage.setItem('installedModules', JSON.stringify(modules));
    } catch (error) {
      logger.error('Failed to save installed modules', { error });
    }
  }

  public async installModule(module: Module): Promise<void> {
    try {
      // Check for dependencies
      const missingDeps = module.dependencies?.filter(dep => {
        const installed = this.installedModules.get(dep.name);
        return !installed || !this.isVersionCompatible(installed.version, dep.version);
      });

      if (missingDeps?.length) {
        throw new Error(`Missing dependencies: ${missingDeps.map(d => d.name).join(', ')}`);
      }

      // Install module
      this.installedModules.set(module.id, module);
      await this.saveInstalledModules();
      logger.info('Module installed successfully', { moduleId: module.id });
    } catch (error) {
      logger.error('Failed to install module', { moduleId: module.id, error });
      throw error;
    }
  }

  public async uninstallModule(moduleId: string): Promise<void> {
    try {
      // Check if other modules depend on this one
      const dependents = Array.from(this.installedModules.values()).filter(module =>
        module.dependencies?.some(dep => dep.name === moduleId)
      );

      if (dependents.length) {
        throw new Error(
          `Cannot uninstall: Module is required by ${dependents.map(m => m.name).join(', ')}`
        );
      }

      this.installedModules.delete(moduleId);
      await this.saveInstalledModules();
      logger.info('Module uninstalled successfully', { moduleId });
    } catch (error) {
      logger.error('Failed to uninstall module', { moduleId, error });
      throw error;
    }
  }

  public async updateModule(moduleId: string, newVersion: Module): Promise<void> {
    try {
      const currentModule = this.installedModules.get(moduleId);
      if (!currentModule) {
        throw new Error('Module not installed');
      }

      // Check version compatibility
      if (!this.isVersionCompatible(newVersion.version, currentModule.version)) {
        throw new Error('Incompatible version');
      }

      this.installedModules.set(moduleId, newVersion);
      await this.saveInstalledModules();
      logger.info('Module updated successfully', { moduleId, version: newVersion.version });
    } catch (error) {
      logger.error('Failed to update module', { moduleId, error });
      throw error;
    }
  }

  public getInstalledModules(): Module[] {
    return Array.from(this.installedModules.values());
  }

  public isModuleInstalled(moduleId: string): boolean {
    return this.installedModules.has(moduleId);
  }

  public getModuleVersion(moduleId: string): string | null {
    const module = this.installedModules.get(moduleId);
    return module?.version || null;
  }

  private isVersionCompatible(version1: string, version2: string): boolean {
    const v1 = this.parseVersion(version1);
    const v2 = this.parseVersion(version2);

    if (v1.major !== v2.major) return false;
    if (v1.minor < v2.minor) return false;
    if (v1.minor === v2.minor && v1.patch < v2.patch) return false;

    return true;
  }

  private parseVersion(version: string): { major: number; minor: number; patch: number } {
    const [major, minor, patch] = version
      .replace(/[^0-9.]/g, '')
      .split('.')
      .map(Number);
    return { major, minor, patch };
  }
}

export const moduleService = ModuleService.getInstance(); 