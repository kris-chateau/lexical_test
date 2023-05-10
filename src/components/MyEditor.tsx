// Import React dependencies.
import { useState } from 'react';
// Import the Slate editor factory.
import { BaseEditor, Descendant, Editor, Transforms, createEditor, Text } from 'slate';
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import HoveringToolbar from './EditorComponents/HoveringToolbar';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

export default function MyEditor() {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <Slate editor={editor} value={initialValue} >
      <HoveringToolbar />
      <Editable
        renderLeaf={props => <Leaf {...props} />}
        onKeyDown={e => console.log(e.key)}
        placeholder='Enter some text svp'
        style={{
          backgroundColor: '#efefef', borderRadius: 7, minHeight: '3em',
          wordWrap: 'break-word', width: 300, wordBreak: 'break-all'
        }}
      />
    </Slate>
  )
}

// acts like a dispatcher in redux
export const toggleFormatting = (editor: ReturnType<typeof useSlate>, format: string, value?: any) => {
  const isActive = isFormatActive(editor, format);
  if (format === 'color') {
    Transforms.setNodes(
      editor,
      { color: value },
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

export function getFormatValue(editor: ReturnType<typeof useSlate>, format: string): Array<any> | undefined {
  const [match] = Editor.nodes(editor, {
    //@ts-ignore
    match: n => (n[format] !== null) && (n[format] !== undefined),
    mode: 'all',
  })
  return match;
}

export function isFormatActive(editor: ReturnType<typeof useSlate>, format: string) {
  const [match] = Editor.nodes(editor, {
    //@ts-ignore
    match: n => (n[format] !== null) && (n[format] !== undefined),
    mode: 'all',
  })
  return !!match
}

// applies the style to small part of the text, called 'leaf'
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
