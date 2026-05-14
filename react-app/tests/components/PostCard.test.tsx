import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PostCard } from '../../src/components/post/card/PostCard';
import { describe, it, expect } from 'vitest';

describe('PostCard', () => {
  it('renders post title and body', () => {
    render(
      <PostCard post={{ id: 1, userId: 1, title: 'Hello', body: 'World' }} />
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });
});
