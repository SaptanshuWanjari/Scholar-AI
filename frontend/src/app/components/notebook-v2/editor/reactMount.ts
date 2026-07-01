import { createRoot, type Root } from "react-dom/client";
import { createElement, type ComponentType } from "react";

export type ReactBlockViewProps<M = any> = { model: M; doc: any };

/**
 * Owns one React root inside a host DOM node. Framework-agnostic so it can be
 * unit-tested without a BlockSuite editor host. `render` is idempotent — call
 * it on every model update; `unmount` tears the root down.
 */
export function mountReact<M = any>(
  container: Element,
  View: ComponentType<ReactBlockViewProps<M>>,
) {
  const root: Root = createRoot(container);
  return {
    render(model: M, doc: unknown) {
      root.render(createElement(View, { model, doc }));
    },
    unmount() {
      root.unmount();
    },
  };
}
