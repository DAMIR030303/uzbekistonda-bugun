import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the homepage with filial selection', () => {
    render(<HomePage />);

    // Check if the main heading is present
    expect(screen.getByText('Assalomu alaykum,')).toBeInTheDocument();

    // Check if welcome message is present
    expect(screen.getByText(/Xush Kelibsiz!/)).toBeInTheDocument();

    // Check if filial selection prompt is present
    expect(screen.getByText(/Bugun uchun ish rejangizni boshlash uchun hududni tanlang/)).toBeInTheDocument();
  });

  it('shows filial cards when no filial is selected', () => {
    render(<HomePage />);

    // Check if filial names are displayed
    expect(screen.getByText('Navoiyda Bugun')).toBeInTheDocument();
    expect(screen.getByText('Samarqandda Bugun')).toBeInTheDocument();
    expect(screen.getByText('Toshkentda Bugun')).toBeInTheDocument();
  });
});
