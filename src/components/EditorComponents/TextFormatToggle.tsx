import { css, cx } from "@emotion/css"
import React, { Ref } from "react"
import { PropsWithChildren } from "react"
import { BaseProps } from "./EditorComponents";
import { useSlate } from "slate-react";
import { toggleFormatting } from "../MyEditor";

type FormatButtonProps = { 
  format: string; 
  label: string;
  isFormatActive: (editor: any, format: string) => boolean;
  toggleFormat: typeof toggleFormatting;
};
export const FormatButton = ({ format, label, isFormatActive, toggleFormat }: FormatButtonProps) => {
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

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed: boolean
      } & BaseProps
    >,
    ref: Ref<HTMLSpanElement> | undefined
  ) => {
    return <span
      {...props}
      ref={ref as Ref<HTMLSpanElement>}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
              ? 'black'
              : '#ccc'};
        `
      )}
    />
  }
)

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLSpanElement> | undefined
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        'material-icons',
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
          background-color: red;
        `
      )}
    />
  )
)
