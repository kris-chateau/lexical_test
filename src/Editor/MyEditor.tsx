// Import React dependencies.
import { ReactNode, useState } from 'react';
// Import the Slate editor factory.
import { BaseEditor, Editor, Transforms, createEditor, Text } from 'slate';
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import HoveringToolbar from './EditorComponents/HoveringToolbar';
import { css } from '@emotion/css';

const initialValue: CustomElement[] = [
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
        placeholder='Enter some text svp'
        className={css`
          background-color: #efefef;
          border-radius: 7;
          min-height: 3em;
          max-height: 10em;
          overflow-y: auto;
          word-wrap: break-word;
          width: 500px;
          border-radius: 4px;
          word-break: break-all;
        `}
      />
    </Slate>
  )
}

// acts like a dispatcher in redux
export const toggleFormatting = (editor: ReturnType<typeof useSlate>, format: string, value?: any) => {
  const isActive = isFormatActive(editor, format);

  if (['bold', 'italic', 'underlined'].includes(format)) {
    Transforms.setNodes(
      editor,
      { [format]: isActive ? null : true },
      { match: Text.isText, split: true }
    );
  } else {
    Transforms.setNodes(
      editor,
      { [format]: value },
      { match: Text.isText, split: true }
    );
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
  const [match] = Editor.nodes<CustomElement>(editor, {
    //@ts-ignore
    match: (n) => (n[format] !== null) && (n[format] !== undefined),
    mode: 'all',
  })
  return !!match
}

// applies the style to small part of the text, called 'leaf'
const Leaf = ({ attributes, children, leaf }: { attributes: Record<any, any>, children: ReactNode, leaf: CustomText }) => {
  if (leaf?.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf?.italic) {
    children = <em>{children}</em>
  }
  if (leaf?.underlined) {
    children = <u>{children}</u>
  }
  if (leaf?.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>
  }
  if (leaf?.backgroundColor) {
    const lowered = leaf?.backgroundColor?.split('')?.map(el => el.toLowerCase()).join('');
    if (lowered !== '#ffffff' && lowered !== '#fff') {
      children = <span style={{ backgroundColor: leaf.backgroundColor }}>{children}</span>
    }
  }

  return <span {...attributes}>{children}</span>
}


// TS DECLARATIONS
export type CustomElement = { type: 'paragraph'; children: CustomText[] };
// TODO extend CustomText for all css stylings in HoveringToolbar
export type CustomText = {
  text: string, bold?: boolean,
  italic?: boolean, underlined?: boolean,
  color?: string, backgroundColor?: string,
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
