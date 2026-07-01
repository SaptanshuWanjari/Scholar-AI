import { LitElement } from "lit";
import { createRoot, type Root } from "react-dom/client";
import { createElement, type ComponentType } from "react";

export type ReactBlockViewProps<M = any> = { model: M; doc: any };

/**
 * Lit element that owns a React root and re-renders when `model` is set.
 * No shadow DOM (so paper-ui global CSS applies).
 */
export function createReactEmbedClass<M = any>(
  View: ComponentType<ReactBlockViewProps<M>>,
) {
  return class ReactEmbedBlock extends LitElement {
    model!: M;
    private _root: Root | null = null;

    // render into light DOM so app CSS + paper-ui styles apply
    protected createRenderRoot() {
      return this;
    }

    connectedCallback() {
      super.connectedCallback();
      this._root = createRoot(this);
      this._renderReact();
    }

    updated() {
      this._renderReact();
    }

    private _renderReact() {
      this._root?.render(
        createElement(View, { model: this.model, doc: (this as any).doc }),
      );
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this._root?.unmount();
      this._root = null;
    }
  };
}
