import { describe, it, expect } from "vitest";
import {
  canViewWriting,
  canEditWriting,
  canDeleteWriting,
} from "@/lib/auth/guards";

describe("Authorization Guards & Privacy Enforcement", () => {
  const publicWriting = {
    authorId: "user_1",
    visibility: "PUBLIC",
    status: "PUBLISHED",
  };

  const privateWriting = {
    authorId: "user_1",
    visibility: "PRIVATE",
    status: "PUBLISHED",
  };

  const draftWriting = {
    authorId: "user_1",
    visibility: "PUBLIC",
    status: "DRAFT",
  };

  it("allows anyone to view public published writings", () => {
    expect(canViewWriting(publicWriting, null)).toBe(true);
    expect(canViewWriting(publicWriting, "user_2")).toBe(true);
    expect(canViewWriting(publicWriting, "user_1")).toBe(true);
  });

  it("strictly prevents non-authors from viewing private writings", () => {
    expect(canViewWriting(privateWriting, null)).toBe(false);
    expect(canViewWriting(privateWriting, "user_2")).toBe(false);
    expect(canViewWriting(privateWriting, "user_1")).toBe(true);
  });

  it("strictly prevents non-authors from viewing drafts", () => {
    expect(canViewWriting(draftWriting, null)).toBe(false);
    expect(canViewWriting(draftWriting, "user_2")).toBe(false);
    expect(canViewWriting(draftWriting, "user_1")).toBe(true);
  });

  it("only allows author to edit or delete writing", () => {
    expect(canEditWriting("user_1", "user_1")).toBe(true);
    expect(canEditWriting("user_1", "user_2")).toBe(false);
    expect(canEditWriting("user_1", null)).toBe(false);

    expect(canDeleteWriting("user_1", "user_1")).toBe(true);
    expect(canDeleteWriting("user_1", "user_2")).toBe(false);
  });
});
