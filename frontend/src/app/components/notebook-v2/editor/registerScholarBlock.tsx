import { createReactEmbedClass, type ReactBlockViewProps } from "./ReactEmbedBlock";
import type { ComponentType } from "react";

/**
 * Bind a scholar flavour to a React view. Returns { flavour, tag }.
 * `specs.ts` wires tag into the BlockSuite view spec.
 */
export function registerScholarBlock<M>(
  flavour: string,
  View: ComponentType<ReactBlockViewProps<M>>,
) {
  const tag = flavour.replace(":", "-"); // scholar:callout -> scholar-callout
  const Klass = createReactEmbedClass<M>((props) => View(props));
  if (!customElements.get(tag)) customElements.define(tag, Klass as any);
  return { flavour, tag };
}
