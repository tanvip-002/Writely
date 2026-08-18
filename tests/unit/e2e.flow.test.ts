import { describe, it, expect } from 'vitest';
import { UserRepository } from '@/repositories/user.repository';
import { WritingService } from '@/services/writing.service';
import { AIService } from '@/services/ai.service';
import { prisma } from '@/lib/db/prisma';

describe('E2E flow: create writing + AI title generation', () => {
  it('creates a writing and gets AI-generated titles', async () => {
    const user = await UserRepository.findByUsername('elena_vance');
    expect(user).toBeTruthy();
    const authorId = user!.id;

    const writing = await WritingService.createWriting(authorId, {
      title: 'E2E Flow: The River Turns',
      content: '<p>A short premise about time and memory.</p>',
      writingType: 'SHORT_STORY',
      visibility: 'PRIVATE',
      status: 'DRAFT',
    });

    expect(writing).toBeTruthy();

    const aiResult = await AIService.executeTool(authorId, {
      tool: 'TITLE',
      text: writing.excerpt || writing.content.slice(0, 200),
    });

    expect(aiResult).toBeTruthy();
    expect(aiResult.output).toBeDefined();

    // cleanup
    await prisma.writing.delete({ where: { id: writing.id } });
  });
});
