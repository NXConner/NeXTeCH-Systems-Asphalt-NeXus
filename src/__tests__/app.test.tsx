import { render } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('registers service worker for PWA', () => {
    expect('serviceWorker' in navigator).toBe(true);
  });
}); 