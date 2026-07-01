import { describe, it, expect } from "vitest";
import { createReactEmbedClass } from "./ReactEmbedBlock";

describe("createReactEmbedClass", () => {
  it("defines a custom element that mounts React and renders model props", async () => {
    const View = ({ model }: any) => <div data-testid="v">{model.text}</div>;
    const Klass = createReactEmbedClass(View);
    customElements.define("scholar-test-embed", Klass as any);

    const el = document.createElement("scholar-test-embed") as any;
    el.model = { text: "hello" };
    document.body.appendChild(el);
    // allow microtask for React root
    await new Promise((r) => setTimeout(r, 0));

    expect(el.querySelector('[data-testid="v"]')?.textContent).toBe("hello");
    el.remove();
  });
});
