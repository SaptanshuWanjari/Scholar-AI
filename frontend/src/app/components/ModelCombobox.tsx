import { PaperSelect } from "@paper-ui/components/inputs";
import type { ProviderModel } from "../lib/api/providers";

export function ModelCombobox({
  models,
  value,
  onChange,
  placeholder = "Search or type a model ID…",
}: {
  models: ProviderModel[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}) {
  const options = models.map((m) => ({
    value: m.id,
    label: m.label,
    icon: m.is_recommended ? (
      <span className="text-amber-500 text-xs">★</span>
    ) : undefined,
  }));

  return (
    <PaperSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      searchable
      allowCustom
    />
  );
}
