import ThemeSelector from '@/components/ui/theme-selector';
import { ResourceAllocation } from '@/components/dashboard/ResourceAllocation';
import { useResourceData } from '@/hooks/useResourceData';
import { ThemeShowcase } from '@/components/ui/theme-showcase';
import { ThemeEffectsShowcase } from '@/components/ui/theme-effects-showcase';
import UnifiedMapInterface from '@/components/UnifiedMapInterface';

export default function ResourcePage() {
  const { resources, isLoading, error } = useResourceData();
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ThemeShowcase />
      <ThemeEffectsShowcase />
      <ThemeSelector />
      <div className="mt-8">
        <UnifiedMapInterface height={400} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Resource Management</h1>
      {isLoading ? (
        <div>Loading resources...</div>
      ) : error ? (
        <div>Error loading resources</div>
      ) : resources.length === 0 ? (
        <div className="text-gray-500">No resources found. Add resources in Supabase to see them here.</div>
      ) : (
        <ResourceAllocation resources={resources} />
      )}
    </div>
  );
} 