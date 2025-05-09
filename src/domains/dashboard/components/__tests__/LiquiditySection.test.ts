import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Import the component to be tested
import LiquiditySection from '../LiquiditySection'; // Adjust the import path as needed

// Mock shadcn Card and Progress components, and lucide-react Info icon
// NOTE: If you are getting an error like "Expected ">" but found "data"",
// this likely indicates a configuration issue in your Vitest/Vite/esbuild setup
// related to parsing JSX in test files or mocks. The syntax below is standard.
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h3 data-testid="card-title">{children}</h3>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
}));

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: { value: number }) => <div data-testid="progress" data-value={value}></div>,
}));

vi.mock('lucide-react', () => ({
  Info: () => <svg data-testid="InfoIcon" />,
  // Add other icons if used directly in this component
}));


describe('LiquiditySection', () => {
  it('renders with invested and liquidity percentages', () => {
    const invested = 75;
    const liquidity = 25;
    render(<LiquiditySection investedPercentage={invested} liquidityPercentage={liquidity} />);

    // Check if the percentages are displayed with two decimal places
    expect(screen.getByText(`Invested ${invested.toFixed(2)}%`)).toBeInTheDocument();
    expect(screen.getByText(`Liquidity ${liquidity.toFixed(2)}%`)).toBeInTheDocument();
  });

  it('renders the progress bar with the correct value', () => {
    const invested = 60;
    render(<LiquiditySection investedPercentage={invested} liquidityPercentage={40} />);

    // Check if the progress bar element exists and has the correct data-value attribute
    expect(screen.getByTestId('progress')).toBeInTheDocument();
    expect(screen.getByTestId('progress')).toHaveAttribute('data-value', invested.toString());
  });

  it('renders the Info icon', () => {
     render(<LiquiditySection investedPercentage={75} liquidityPercentage={25} />);
     // Check if the mock Info icon is rendered
     expect(screen.getByTestId('InfoIcon')).toBeInTheDocument();
  });
});
