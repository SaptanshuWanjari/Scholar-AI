import type { ReactBlockViewProps } from "../editor/ReactEmbedBlock";
import { SketchDivider } from "@/paper-ui/components/decorations";

export function PageBreakView({ model }: ReactBlockViewProps<any>) {
  return (
    <div className="my-4 select-none" contentEditable={false}>
      <SketchDivider />
      <div className="text-center font-caveat text-xs text-ink/40">
        {model.label || "Page break"}
      </div>
    </div>
  );
}
export default PageBreakView;
