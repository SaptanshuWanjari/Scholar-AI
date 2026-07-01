import type { ReactBlockViewProps } from "../editor/ReactEmbedBlock";
import { StickyNoteCard } from "@/paper-ui/components/cards";

export function StickyNoteView({ model, doc }: ReactBlockViewProps<any>) {
  return (
    <div className={model.align === "right-rail" ? "ml-auto max-w-[280px] my-2" : "my-2 max-w-[360px]"}>
      <StickyNoteCard color={model.color ?? "yellow"} pin={model.pin ?? "push-pin"}>
        <div
          className="outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => doc.updateBlock(model, { text: e.currentTarget.textContent ?? "" })}
        >
          {model.text}
        </div>
      </StickyNoteCard>
    </div>
  );
}
export default StickyNoteView;
