import { html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { ComponentType } from "react";
import { BlockComponent } from "../../../lib/blocksuite/api";
import type { BlockModel } from "../../../lib/blocksuite/api";
import { mountReact, type ReactBlockViewProps } from "./reactMount";

export type { ReactBlockViewProps } from "./reactMount";

/**
 * Build a scholar view element: a BlockComponent (light-DOM, so paper-ui global
 * CSS applies) that owns a React root. The editor injects `model`/`doc`/`std`;
 * BlockComponent re-renders on `model.propsUpdated`, and `updated()` re-renders
 * the React tree with the fresh model.
 */
export function createScholarBlockClass<M extends BlockModel = BlockModel>(
  View: ComponentType<ReactBlockViewProps<M>>,
) {
  return class ScholarBlock extends BlockComponent<M> {
    #host = createRef<HTMLDivElement>();
    #mount: ReturnType<typeof mountReact<M>> | null = null;

    override renderBlock() {
      // contenteditable=false: the React subtree manages its own editing; keep
      // BlockSuite's text machinery out of it.
      return html`<div ${ref(this.#host)} contenteditable="false" class="scholar-embed"></div>`;
    }

    override updated() {
      const el = this.#host.value;
      if (!el) return;
      if (!this.#mount) this.#mount = mountReact<M>(el, View);
      this.#mount.render(this.model, this.doc);
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      const mount = this.#mount;
      this.#mount = null;
      // Defer: React forbids unmount during its own render/commit phase.
      if (mount) queueMicrotask(() => mount.unmount());
    }
  };
}
