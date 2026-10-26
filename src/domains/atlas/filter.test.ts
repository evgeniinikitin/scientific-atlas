import { describe, expect, it } from "vitest";
import { filterNodes, filterProblems } from "./filter";
import { problems } from "@/data/atlas";

describe("фильтрация атласа", () => {
  it("ищет проблемы по тегам и сортирует по активности", () => {
    expect(filterProblems(problems, "Катализ", "activity").map((item) => item.slug)).toEqual(["nitrogen-fixation", "artificial-photosynthesis"]);
  });
  it("комбинирует текст, тип и статус вершин", () => {
    const nodes = problems[0].nodes;
    expect(filterNodes(nodes, "спектраль", ["direction"], ["open"]).map((node) => node.id)).toEqual(["rh-spectral"]);
    expect(filterNodes(nodes, "несуществующая вершина", [], [])).toHaveLength(0);
  });
});
