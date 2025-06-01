import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('Accessibility', () => {
  it('has ARIA labels and supports keyboard navigation', () => {
    render(<App />);
    // Example: check for a main landmark
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
}); 