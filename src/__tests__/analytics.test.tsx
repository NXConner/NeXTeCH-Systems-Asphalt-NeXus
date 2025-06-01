import { render } from '@testing-library/react';
import { UnifiedReports } from '../components/dashboard/UnifiedReports';
import { ExportUtility } from '../components/export/ExportUtility';

describe('Analytics & Reporting', () => {
  it('renders UnifiedReports dashboard', () => {
    render(<UnifiedReports />);
  });

  it('renders ExportUtility', () => {
    render(<ExportUtility data={[]} filename="test" availableFields={[]} type="test" />);
  });
}); 