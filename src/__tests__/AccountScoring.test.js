import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest, describe, it, expect } from '@jest/globals';
import { Wizard } from '../components/AccountScoring';

describe('AccountScoring Wizard', () => {
  it('renders all steps', () => {
    render(<Wizard onComplete={() => {}} />);
    
    expect(screen.getByText('Data Source')).toBeInTheDocument();
    expect(screen.getByText('Field Selection')).toBeInTheDocument();
    expect(screen.getByText('Model Configuration')).toBeInTheDocument();
    expect(screen.getByText('Scoring Parameters')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('starts with the first step', () => {
    render(<Wizard onComplete={() => {}} />);
    
    expect(screen.getByText('Import Your Account Data')).toBeInTheDocument();
  });

  it('disables Next button when step is incomplete', () => {
    render(<Wizard onComplete={() => {}} />);
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });
}); 