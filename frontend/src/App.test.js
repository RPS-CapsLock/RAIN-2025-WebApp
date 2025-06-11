import { render, screen } from '@testing-library/react';
import App from './App';

test('CocktailBox title', () => {
  render(<App />);
  const headerElements = screen.getAllByText(/CocktailBox/i);
  expect(headerElements[0]).toBeTruthy();
});

test('Login link', () => {
  render(<App />);
  const loginLink = screen.getByText(/Prijava/i);
  expect(loginLink).toBeTruthy();
});

test('Register link', () => {
  render(<App />);
  const registerLink = screen.getByText(/Registracija/i);
  expect(registerLink).toBeTruthy();
});
