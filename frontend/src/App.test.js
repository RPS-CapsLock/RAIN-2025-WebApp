import { render, screen } from '@testing-library/react';
import App from './App';

test('CocktailBox title in navbar', () => {
  render(<App />);
  const headerElements = screen.getAllByText(/CocktailBox/i);
  expect(headerElements[0]).toBeTruthy();
});
