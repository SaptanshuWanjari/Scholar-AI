import { Group, Rect, Text } from 'react-konva'
import type { SceneObject } from '../types'

type StickyObj = Extract<SceneObject, { type: 'sticky' }>

export function RenderSticky({ obj }: { obj: StickyObj }) {
  return (
    <Group id={obj.id} x={obj.x} y={obj.y} rotation={obj.rotation ?? 0} draggable={false}>
      <Rect
        width={obj.w}
        height={obj.h}
        fill={obj.style.color}
        cornerRadius={4}
        shadowBlur={4}
        shadowOpacity={0.15}
        shadowOffsetY={2}
      />
      <Text
        x={8}
        y={8}
        width={obj.w - 16}
        height={obj.h - 16}
        text={obj.content}
        fontSize={13}
        fill="#211f1b"
        fontFamily="Inter, sans-serif"
        wrap="word"
      />
    </Group>
  )
}
