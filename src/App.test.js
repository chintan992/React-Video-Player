import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Welcome to LetsStream heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/welcome to letsstream/i);
  expect(headingElement).toBeInTheDocument();
});
