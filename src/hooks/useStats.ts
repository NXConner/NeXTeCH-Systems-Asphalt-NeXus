import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface Stats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  totalVehicles: number;
  activeVehicles: number;
  maintenanceDue: number;
  totalInventory: number;
  lowStock: number;
  reorderNeeded: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalVehicles: 0,
    activeVehicles: 0,
    maintenanceDue: 0,
    totalInventory: 0,
    lowStock: 0,
    reorderNeeded: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch projects stats
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('status');

        if (projectsError) throw projectsError;

        // Fetch tasks stats
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('status');

        if (tasksError) throw tasksError;

        // Fetch vehicles stats
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('status, maintenance_due');

        if (vehiclesError) throw vehiclesError;

        // Fetch inventory stats
        const { data: inventory, error: inventoryError } = await supabase
          .from('inventory')
          .select('quantity, reorder_point');

        if (inventoryError) throw inventoryError;

        // Calculate stats
        const newStats: Stats = {
          totalProjects: projects?.length || 0,
          activeProjects: projects?.filter(p => p.status === 'active').length || 0,
          completedProjects: projects?.filter(p => p.status === 'completed').length || 0,
          totalTasks: tasks?.length || 0,
          pendingTasks: tasks?.filter(t => t.status === 'pending').length || 0,
          completedTasks: tasks?.filter(t => t.status === 'completed').length || 0,
          totalVehicles: vehicles?.length || 0,
          activeVehicles: vehicles?.filter(v => v.status === 'active').length || 0,
          maintenanceDue: vehicles?.filter(v => v.maintenance_due).length || 0,
          totalInventory: inventory?.length || 0,
          lowStock: inventory?.filter(i => i.quantity < i.reorder_point).length || 0,
          reorderNeeded: inventory?.filter(i => i.quantity <= i.reorder_point).length || 0
        };

        setStats(newStats);
        logger.info('Stats fetched successfully', { stats: newStats });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
        setError(errorMessage);
        logger.error('Error fetching stats', { error: err });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}; 