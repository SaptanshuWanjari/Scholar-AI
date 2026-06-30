import { Text } from 'react-konva'
import type { SceneObject } from '../types'

type TextObj = Extract<SceneObject, { type: 'text' }>

export function RenderText({ obj }: { obj: TextObj }) {
  return (
    <Text
      id={obj.id}
      x={obj.x}
      y={obj.y}
      rotation={obj.rotation ?? 0}
      text={obj.content}
      fontSize={obj.style.fontSize}
      fill={obj.style.fill}
      fontFamily={obj.style.fontFamily}
      draggable={false}
    />
  )
}
