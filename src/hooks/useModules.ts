import { useState, useEffect, useCallback } from 'react';
import { Module, ModuleFilters, ModuleSearchResult } from '@/types/module';
import { moduleApi } from '@/services/moduleApi';
import { moduleService } from '@/services/moduleService';
import { logger } from '@/services/logger';

export function useModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ModuleFilters>({});
  const [searchResult, setSearchResult] = useState<ModuleSearchResult | null>(null);

  const fetchModules = useCallback(async (params?: ModuleFilters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await moduleApi.getModules(params);
      setModules(result);
      setSearchResult({
        modules: result,
        total: result.length,
        page: 1,
        pageSize: result.length,
        hasMore: false
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch modules');
      logger.error('Failed to fetch modules', { error, params });
    } finally {
      setLoading(false);
    }
  }, []);

  const searchModules = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await moduleApi.getModules({ ...filters, search: query });
      setModules(result);
      setSearchResult({
        modules: result,
        total: result.length,
        page: 1,
        pageSize: result.length,
        hasMore: false
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search modules');
      logger.error('Failed to search modules', { error, query });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const applyFilters = useCallback(async (newFilters: ModuleFilters) => {
    setFilters(newFilters);
    await fetchModules(newFilters);
  }, [fetchModules]);

  const sortModules = useCallback(async (sortBy: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await moduleApi.getModules({ ...filters, sort: sortBy });
      setModules(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sort modules');
      logger.error('Failed to sort modules', { error, sortBy });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const installModule = useCallback(async (module: Module) => {
    try {
      setLoading(true);
      setError(null);
      await moduleService.installModule(module);
      logger.info('Module installed successfully', { moduleId: module.id });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to install module');
      logger.error('Failed to install module', { error, moduleId: module.id });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const uninstallModule = useCallback(async (moduleId: string) => {
    try {
      setLoading(true);
      setError(null);
      await moduleService.uninstallModule(moduleId);
      logger.info('Module uninstalled successfully', { moduleId });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to uninstall module');
      logger.error('Failed to uninstall module', { error, moduleId });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateModule = useCallback(async (moduleId: string, newVersion: Module) => {
    try {
      setLoading(true);
      setError(null);
      await moduleService.updateModule(moduleId, newVersion);
      logger.info('Module updated successfully', { moduleId, version: newVersion.version });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update module');
      logger.error('Failed to update module', { error, moduleId });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInstalledModules = useCallback(() => {
    return moduleService.getInstalledModules();
  }, []);

  const isModuleInstalled = useCallback((moduleId: string) => {
    return moduleService.isModuleInstalled(moduleId);
  }, []);

  const getModuleVersion = useCallback((moduleId: string) => {
    return moduleService.getModuleVersion(moduleId);
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return {
    modules,
    loading,
    error,
    filters,
    searchResult,
    fetchModules,
    searchModules,
    applyFilters,
    sortModules,
    installModule,
    uninstallModule,
    updateModule,
    getInstalledModules,
    isModuleInstalled,
    getModuleVersion
  };
}

export function useModuleDetails(moduleId: string) {
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModuleDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await moduleApi.getModuleById(moduleId);
      setModule(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch module details');
      logger.error('Failed to fetch module details', { error, moduleId });
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchModuleDetails();
  }, [fetchModuleDetails]);

  return {
    module,
    loading,
    error,
    fetchModuleDetails
  };
}

export function useModuleUpdates() {
  const [updates, setUpdates] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await moduleApi.getModuleUpdates();
      setUpdates(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch module updates');
      logger.error('Failed to fetch module updates', { error });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return {
    updates,
    loading,
    error,
    fetchUpdates
  };
}

export function useFeaturedModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedModules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await moduleApi.getFeaturedModules();
      setModules(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch featured modules');
      logger.error('Failed to fetch featured modules', { error });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedModules();
  }, [fetchFeaturedModules]);

  return {
    modules,
    loading,
    error,
    fetchFeaturedModules
  };
} 