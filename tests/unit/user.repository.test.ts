import { describe, it, expect, beforeAll } from 'vitest';
import { UserRepository } from '@/repositories/user.repository';

beforeAll(async () => {
  // DB should already be seeded by the development setup
});

describe('UserRepository', () => {
  it('finds demo user elena_vance', async () => {
    const user = await UserRepository.findByUsername('elena_vance');
    expect(user).toBeTruthy();
    expect(user?.username).toBe('elena_vance');
    expect(user?.email).toBe('elena@writely.dev');
  });
});
