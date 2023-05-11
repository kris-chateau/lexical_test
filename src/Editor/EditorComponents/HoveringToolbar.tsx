import { PropsWithChildren, Ref } from "react";
import { useEffect, useRef } from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";
import { css, cx } from "@emotion/css";
import ReactDOM from "react-dom";
import { FormatButton } from "./TextFormatToggle";
import ColorPicker from "./ColorPicker";
import { getFormatValue, isFormatActive, toggleFormatting } from "../MyEditor";
import React from "react";

export interface BaseProps {
  className: string
  [key: string]: unknown
}

export default function HoveringToolbar() {
  const ref = useRef<HTMLDivElement | undefined>();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return
    }
    const { selection } = editor;

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      // hiding toolbar
      el.removeAttribute('style')
      return
    }

    // positionning correctly the toolbar and displaying it
    const domSelection = window.getSelection()
    const domRange = domSelection!.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${rect.left +
      window.pageXOffset -
      el.offsetWidth / 2 +
      rect.width / 2}px`
  });

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
          background-color: #DEDEDE;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
        onMouseDown={(e: MouseEvent) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <FormatButton format="bold" label="Bold" isFormatActive={isFormatActive} toggleFormat={toggleFormatting} />
        <FormatButton format="italic" label="italic" isFormatActive={isFormatActive} toggleFormat={toggleFormatting} />
        <FormatButton format="underlined" label="underlined" isFormatActive={isFormatActive} toggleFormat={toggleFormatting} />
        <ColorPicker
          getColorValue={() => { // used for styling 'color' in CSS
            let formatArray = getFormatValue(editor, 'color');
            let colorValue = "#000000";
            if (Array.isArray(formatArray) && formatArray.length && formatArray[0]?.color) {
              colorValue = formatArray[0]?.color;
            }
            return colorValue;
          }}
          defaultColor={'#000000'}
          onColor={(color) => toggleFormatting(editor, 'color', color)}
        />
        <ColorPicker
          getColorValue={() => { // used for styling 'backgroundColor' in CSS
            let formatArray = getFormatValue(editor, 'backgroundColor');
            let colorValue = "#FFFFFF";
            if (Array.isArray(formatArray) && formatArray.length && formatArray[0]?.backgroundColor) {
              colorValue = formatArray[0]?.backgroundColor;
            }
            return colorValue;
          }}
          defaultColor={'#FFFFFF'}
          onColor={(color) => toggleFormatting(editor, 'backgroundColor', color)}
        />
      </Menu>
    </Portal>
  )
}

export const Portal = ({ children }: PropsWithChildren) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
}

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement> | undefined
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          display: flex;
          align-items: end;
          & > * + * {
            margin-left: 15px;
          }
        `
      )}
    />
  )
)
