import { beforeEach, describe, expect, it } from "vitest";
import { useUserStore } from "./store";

describe("избранное", () => {
  beforeEach(() => useUserStore.setState({ bookmarks: [], recent: [], demoSession: false }));
  it("добавляет и повторным действием удаляет вершину", () => {
    const item = { id: "node-1", title: "Вершина", kind: "node" as const, problemSlug: "problem" };
    expect(useUserStore.getState().toggleBookmark(item)).toBe(true);
    expect(useUserStore.getState().isBookmarked("node-1", "node")).toBe(true);
    expect(useUserStore.getState().toggleBookmark(item)).toBe(false);
    expect(useUserStore.getState().bookmarks).toHaveLength(0);
  });
});
