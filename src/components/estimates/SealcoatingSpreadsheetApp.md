# SealcoatingSpreadsheetApp Usage Tracking

This component now supports:
- Single cell and multi-cell (range) selection (click, drag, or shift+click)
- Batch mapping: select a range and map each value to a field in EstimateForm, CostCalculator, AdvancedPricingCalculator, and MobileEstimateForm
- Visual selection highlight for batch import
- Tooltips and ARIA labels for accessibility
- Error handling for invalid ranges and import/export errors
- Used in:
  - src/pages/Dashboard.tsx
  - src/pages/Estimates.tsx
  - src/components/costs/CostCalculator.tsx
  - src/components/estimates/EstimateForm.tsx
  - src/components/estimates/MobileEstimateForm.tsx
  - src/components/estimates/AdvancedPricingCalculator.tsx

## New Features
- Multi-cell import: select a range of cells and import all values at once
- Batch mapping: guided UI to map each imported value to a form field
- Accessibility: tooltips, ARIA labels, keyboard navigation
- Error handling: user feedback for invalid operations, import/export issues

Update this file as the implementation progresses. 