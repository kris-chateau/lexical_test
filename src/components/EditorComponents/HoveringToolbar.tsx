import React, { PropsWithChildren, Ref } from "react";
import { useEffect, useRef } from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";
import { BaseProps, Menu } from "./EditorComponents";
import { css, cx } from "@emotion/css";
import ReactDOM from "react-dom";
import { FormatButton } from "./TextFormatToggle";
import ColorPicker from "./ColorPicker";
import { isFormatActive, toggleFormatting } from "../MyEditor";

export default function HoveringToolbar() {
  const ref = useRef<HTMLDivElement | undefined>();
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
        <ColorPicker selectedColor="" toggleFormat={toggleFormatting} />
      </Menu>
    </Portal>
  )
}

export const Portal = ({ children }: PropsWithChildren) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement> | undefined
  ) => (
    <Menu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          padding: 1px 18px 17px;
          margin: 0 -20px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        `
      )}
    />
  )
)
