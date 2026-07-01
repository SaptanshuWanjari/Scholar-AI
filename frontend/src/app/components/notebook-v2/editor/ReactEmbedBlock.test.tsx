import { describe, it, expect } from "vitest";
import { mountReact } from "./reactMount";

describe("mountReact", () => {
  it("renders a React view from model props and re-renders on update", async () => {
    const View = ({ model }: any) => <div data-testid="v">{model.text}</div>;
    const host = document.createElement("div");
    document.body.appendChild(host);

    const m = mountReact(host, View);
    m.render({ text: "hello" }, {});
    await new Promise((r) => setTimeout(r, 0));
    expect(host.querySelector('[data-testid="v"]')?.textContent).toBe("hello");

    m.render({ text: "world" }, {});
    await new Promise((r) => setTimeout(r, 0));
    expect(host.querySelector('[data-testid="v"]')?.textContent).toBe("world");

    m.unmount();
    host.remove();
  });
});
