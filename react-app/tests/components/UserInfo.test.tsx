import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { UserInfo } from '../../src/components/UserInfo';
import { describe, it, expect } from 'vitest';

describe('UserInfo', () => {
  it('renders user name and email', () => {
    render(
      <UserInfo user={{ id: 1, name: 'Jane Doe', email: 'jane@example.com' }} />
    );
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/jane@example.com/)).toBeInTheDocument();
  });
});
