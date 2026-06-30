import { useState } from 'react'
import { cn } from '../ui/utils'

const PRESETS = [
  '#000000', '#343a40', '#868e96', '#c92a2a',
  '#e03131', '#f08c00', '#f59f00', '#2f9e44',
  '#0c8599', '#1971c2', '#6741d9', '#c2255c',
  '#ffffff',
]

interface ColorPickerPopoverProps {
  color: string
  onChange: (color: string) => void
  allowNone?: boolean
  label?: string
}

export function ColorPickerPopover({ color, onChange, allowNone, label }: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false)

  const swatchStyle: React.CSSProperties =
    color === 'none'
      ? { background: 'linear-gradient(135deg, #fff 45%, #f03e3e 45%, #f03e3e 55%, #fff 55%)' }
      : { background: color, outline: color === '#ffffff' ? '1px solid #d1d5db' : undefined }

  return (
    <div className="relative flex flex-col items-center">
      {label && (
        <span className="text-[8px] text-muted-foreground leading-none mb-0.5 select-none">{label}</span>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-5 h-5 rounded border-2 border-border hover:border-foreground/50 transition-colors"
        style={swatchStyle}
        title={label}
      />
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-full top-0 ml-2 z-50 bg-popover border border-border rounded-md shadow-lg p-2 w-[116px]">
            <div className="grid grid-cols-4 gap-1 mb-2">
              {allowNone && (
                <button
                  onClick={() => { onChange('none'); setOpen(false) }}
                  className={cn(
                    'w-6 h-6 rounded border-2 transition-colors',
                    color === 'none' ? 'border-foreground' : 'border-transparent hover:border-border',
                  )}
                  style={{ background: 'linear-gradient(135deg, #fff 45%, #f03e3e 45%, #f03e3e 55%, #fff 55%)' }}
                  title="No fill"
                />
              )}
              {PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => { onChange(c); setOpen(false) }}
                  className={cn(
                    'w-6 h-6 rounded border-2 transition-colors',
                    color === c ? 'border-foreground' : 'border-transparent hover:border-border',
                  )}
                  style={{
                    background: c,
                    outline: c === '#ffffff' ? '1px solid #d1d5db' : undefined,
                  }}
                  title={c}
                />
              ))}
            </div>
            <input
              type="color"
              value={color === 'none' ? '#ffffff' : color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-6 cursor-pointer rounded border border-border p-0"
              title="Custom color"
            />
          </div>
        </>
      )}
    </div>
  )
}
