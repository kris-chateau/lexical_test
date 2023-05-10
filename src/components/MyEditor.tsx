// Import React dependencies.
import { Ref, useEffect, useRef, useState } from 'react';
// Import the Slate editor factory.
import { BaseEditor, Descendant, Editor, Transforms, createEditor, Range, Text } from 'slate';
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor, useSlate, useFocused } from 'slate-react';
import { Button, Icon, Menu, Portal } from './EditorComponents/EditorComponents';
import { css } from '@emotion/css';
import ColorPicker from './EditorComponents/ColorPicker';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

export default function MyEditor() {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <Slate editor={editor} value={initialValue} >
      <HoveringToolbar />
      <Editable
        renderLeaf={props => <Leaf {...props} />}
        onKeyDown={e => console.log(e.key)}
        placeholder='Enter some text svp'
        style={{ backgroundColor: '#eee', borderRadius: 7, minHeight: '3em', wordWrap: 'break-word', width: 300, wordBreak: 'break-all' }}
      />
    </Slate>
  )
}

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>()
  const editor = useSlate()
  const inFocus = useFocused()

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection!.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${rect.left +
      window.pageXOffset -
      el.offsetWidth / 2 +
      rect.width / 2}px`
  })

  return (
    <Portal>
      <Menu
        ref={ref as Ref<HTMLDivElement>}
        className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #a5a5a5;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
        onMouseDown={(e: MouseEvent) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault()
        }}
      >
        <FormatButton format="bold" label="format_bold" isFormatActive={isFormatActive} toggleFormat={toggleFormatting} />
        <FormatButton format="italic" label="format_italic" isFormatActive={isFormatActive} toggleFormat={toggleFormatting} />
        <FormatButton format="underlined" label="format_underlined" isFormatActive={isFormatActive} toggleFormat={toggleFormatting} />
        <ColorPicker active onChoice={(c) => console.log(c)} toggleFormat={toggleFormatting} />
      </Menu>
    </Portal>
  )
}

export const toggleFormatting = (editor: ReturnType<typeof useSlate>, format: string) => {
  const isActive = isFormatActive(editor, format)
  if (format === 'color') {
    Transforms.setNodes(
      editor,
      { color: isActive ? undefined : '' },
      { match: Text.isText, split: true }
    )
  } else {
    Transforms.setNodes(
      editor,
      { [format]: isActive ? null : true },
      { match: Text.isText, split: true }
    )
  }
}

export const isFormatActive = (editor: ReturnType<typeof useSlate>, format: string) => {
  const [match] = Editor.nodes(editor, {
    //@ts-ignore
    match: n => n[format] === true,
    mode: 'all',
  })
  return !!match
}

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underlined) {
    children = <u>{children}</u>
  }

  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>
  }

  return <span {...attributes}>{children}</span>
}

type FormatButtonProps = { 
  format: string; 
  label: string;
  isFormatActive: (editor: any, format: string) => boolean;
  toggleFormat: (editor: any, format: string) => void;
};
const FormatButton = ({ format, label, isFormatActive, toggleFormat }: FormatButtonProps) => {
  const editor = useSlate()
  return (
    <Button
      reversed
      active={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
      <Icon>{label}</Icon>
    </Button>
  )
}

// TS DECLARATIONS
type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string, bold?: boolean, italic?: boolean, underlined?: boolean, color?: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
