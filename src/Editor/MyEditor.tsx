// Import React dependencies.
import { ReactNode, Ref, forwardRef, useImperativeHandle, useState } from 'react';
// Import the Slate editor factory.
import { BaseEditor, Editor, Transforms, createEditor, Text, Node } from 'slate';
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import HoveringToolbar from './EditorComponents/HoveringToolbar';
import { css } from '@emotion/css';

const initialValue: ParagraphElement[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

function MyEditor(props: EditorProps, _ref: Ref<EditorRef>) {
  const [editor] = useState(() => withReact(createEditor()));
  const [editorState, setEditorState] = useState<Array<ParagraphElement>>([]);

  useImperativeHandle(props.innerRef, (): EditorRef => ({
    serialize() {
      if (!editorState.length) {
        console.error(new Error('Could not serialize. No nodes found.'));
        return null;
      }
      return JSON.stringify(editorState[0]?.children);
    },
    getPlainText() {
      if (!editorState.length) {
        console.error(new Error('Could not serialize. No nodes found.'));
        return null;
      }
      return Node.string(editorState[0]);
    }
  }));

  return (
    <Slate editor={editor}
      onChange={(value: ParagraphElement[]) => {
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        );
        if (isAstChange) {
          setEditorState(value);
        }
      }}
      value={initialValue}
    >
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

type EditorProps = {
  innerRef: Ref<any>
}
export type EditorRef = {
  serialize: () => string;
  getPlainText: () => string;
}
export default forwardRef<EditorRef, EditorProps>(MyEditor);

// acts like a dispatcher in redux
export const toggleFormatting = (editor: ReturnType<typeof useSlate>, format: keyof CustomText, value?: any) => {
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
    match: (n: any) => (n[format] !== null) && (n[format] !== undefined),
    mode: 'all',
  })
  return match;
}

export function isFormatActive(editor: ReturnType<typeof useSlate>, format: keyof CustomText) {
  const [match] = Editor.nodes<ParagraphElement>(editor, {
    match: (n: any) => (n[format] !== null) && (n[format] !== undefined),
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
export type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
// TODO extend CustomText for all css stylings in HoveringToolbar
export type CustomText = {
  text: string, bold?: boolean,
  italic?: boolean, underlined?: boolean,
  color?: string, backgroundColor?: string,
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: ParagraphElement
    Text: CustomText
  }
}
