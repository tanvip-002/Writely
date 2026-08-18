import { describe, it, expect } from 'vitest';
import { UserRepository } from '@/repositories/user.repository';
import { WritingService } from '@/services/writing.service';
import { prisma } from '@/lib/db/prisma';

describe('WritingService', () => {
  it('creates and deletes a writing for demo user', async () => {
    const user = await UserRepository.findByUsername('elena_vance');
    expect(user).toBeTruthy();
    const authorId = user!.id;

    const writing = await WritingService.createWriting(authorId, {
      title: 'Unit Test: A Small Tale',
      content: '<p>This is test content.</p>',
      writingType: 'SHORT_STORY',
      visibility: 'PRIVATE',
      status: 'DRAFT',
    });

    expect(writing).toBeTruthy();
    expect(writing.title).toBe('Unit Test: A Small Tale');

    // cleanup
    await prisma.writing.delete({ where: { id: writing.id } });
  });
});
