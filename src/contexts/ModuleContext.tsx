import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Module, ModuleFilters, ModuleSearchResult } from '@/types/module';
import { moduleApi } from '@/services/moduleApi';
import { moduleService } from '@/services/moduleService';
import { logger } from '@/services/logger';

interface ModuleState {
  modules: Module[];
  installedModules: Module[];
  loading: boolean;
  error: string | null;
  filters: ModuleFilters;
  searchResult: ModuleSearchResult | null;
  selectedModule: Module | null;
  installationProgress: { [key: string]: number };
}

type ModuleAction =
  | { type: 'SET_MODULES'; payload: Module[] }
  | { type: 'SET_INSTALLED_MODULES'; payload: Module[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: ModuleFilters }
  | { type: 'SET_SEARCH_RESULT'; payload: ModuleSearchResult }
  | { type: 'SET_SELECTED_MODULE'; payload: Module | null }
  | { type: 'SET_INSTALLATION_PROGRESS'; payload: { moduleId: string; progress: number } }
  | { type: 'CLEAR_INSTALLATION_PROGRESS'; payload: string };

const initialState: ModuleState = {
  modules: [],
  installedModules: [],
  loading: false,
  error: null,
  filters: {},
  searchResult: null,
  selectedModule: null,
  installationProgress: {}
};

function moduleReducer(state: ModuleState, action: ModuleAction): ModuleState {
  switch (action.type) {
    case 'SET_MODULES':
      return { ...state, modules: action.payload };
    case 'SET_INSTALLED_MODULES':
      return { ...state, installedModules: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_SEARCH_RESULT':
      return { ...state, searchResult: action.payload };
    case 'SET_SELECTED_MODULE':
      return { ...state, selectedModule: action.payload };
    case 'SET_INSTALLATION_PROGRESS':
      return {
        ...state,
        installationProgress: {
          ...state.installationProgress,
          [action.payload.moduleId]: action.payload.progress
        }
      };
    case 'CLEAR_INSTALLATION_PROGRESS':
      const { [action.payload]: _, ...rest } = state.installationProgress;
      return { ...state, installationProgress: rest };
    default:
      return state;
  }
}

interface ModuleContextType extends ModuleState {
  fetchModules: (params?: ModuleFilters) => Promise<void>;
  searchModules: (query: string) => Promise<void>;
  applyFilters: (filters: ModuleFilters) => Promise<void>;
  sortModules: (sortBy: string) => Promise<void>;
  installModule: (module: Module) => Promise<void>;
  uninstallModule: (moduleId: string) => Promise<void>;
  updateModule: (moduleId: string, newVersion: Module) => Promise<void>;
  selectModule: (module: Module | null) => void;
  setInstallationProgress: (moduleId: string, progress: number) => void;
  clearInstallationProgress: (moduleId: string) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(moduleReducer, initialState);

  const fetchModules = useCallback(async (params?: ModuleFilters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await moduleApi.getModules(params);
      dispatch({ type: 'SET_MODULES', payload: result });
      dispatch({
        type: 'SET_SEARCH_RESULT',
        payload: {
          modules: result,
          total: result.length,
          page: 1,
          pageSize: result.length,
          hasMore: false
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch modules';
      dispatch({ type: 'SET_ERROR', payload: message });
      logger.error('Failed to fetch modules', { error, params });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const searchModules = useCallback(async (query: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await moduleApi.getModules({ ...state.filters, search: query });
      dispatch({ type: 'SET_MODULES', payload: result });
      dispatch({
        type: 'SET_SEARCH_RESULT',
        payload: {
          modules: result,
          total: result.length,
          page: 1,
          pageSize: result.length,
          hasMore: false
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to search modules';
      dispatch({ type: 'SET_ERROR', payload: message });
      logger.error('Failed to search modules', { error, query });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters]);

  const applyFilters = useCallback(async (filters: ModuleFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
    await fetchModules(filters);
  }, [fetchModules]);

  const sortModules = useCallback(async (sortBy: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await moduleApi.getModules({ ...state.filters, sort: sortBy });
      dispatch({ type: 'SET_MODULES', payload: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sort modules';
      dispatch({ type: 'SET_ERROR', payload: message });
      logger.error('Failed to sort modules', { error, sortBy });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters]);

  const installModule = useCallback(async (module: Module) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      await moduleService.installModule(module);
      const installedModules = moduleService.getInstalledModules();
      dispatch({ type: 'SET_INSTALLED_MODULES', payload: installedModules });
      logger.info('Module installed successfully', { moduleId: module.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to install module';
      dispatch({ type: 'SET_ERROR', payload: message });
      logger.error('Failed to install module', { error, moduleId: module.id });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const uninstallModule = useCallback(async (moduleId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      await moduleService.uninstallModule(moduleId);
      const installedModules = moduleService.getInstalledModules();
      dispatch({ type: 'SET_INSTALLED_MODULES', payload: installedModules });
      logger.info('Module uninstalled successfully', { moduleId });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to uninstall module';
      dispatch({ type: 'SET_ERROR', payload: message });
      logger.error('Failed to uninstall module', { error, moduleId });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateModule = useCallback(async (moduleId: string, newVersion: Module) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      await moduleService.updateModule(moduleId, newVersion);
      const installedModules = moduleService.getInstalledModules();
      dispatch({ type: 'SET_INSTALLED_MODULES', payload: installedModules });
      logger.info('Module updated successfully', { moduleId, version: newVersion.version });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update module';
      dispatch({ type: 'SET_ERROR', payload: message });
      logger.error('Failed to update module', { error, moduleId });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const selectModule = useCallback((module: Module | null) => {
    dispatch({ type: 'SET_SELECTED_MODULE', payload: module });
  }, []);

  const setInstallationProgress = useCallback((moduleId: string, progress: number) => {
    dispatch({ type: 'SET_INSTALLATION_PROGRESS', payload: { moduleId, progress } });
  }, []);

  const clearInstallationProgress = useCallback((moduleId: string) => {
    dispatch({ type: 'CLEAR_INSTALLATION_PROGRESS', payload: moduleId });
  }, []);

  React.useEffect(() => {
    const installedModules = moduleService.getInstalledModules();
    dispatch({ type: 'SET_INSTALLED_MODULES', payload: installedModules });
    fetchModules();
  }, [fetchModules]);

  const value = {
    ...state,
    fetchModules,
    searchModules,
    applyFilters,
    sortModules,
    installModule,
    uninstallModule,
    updateModule,
    selectModule,
    setInstallationProgress,
    clearInstallationProgress
  };

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
}

export function useModuleContext() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModuleContext must be used within a ModuleProvider');
  }
  return context;
} 