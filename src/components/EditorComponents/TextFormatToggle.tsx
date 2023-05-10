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
      active={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
      <span className={css`
        font-size: 18px;
        vertical-align: text-bottom;
        background-color: #c4c4c4;
        padding: 4px;
        border-radius: 5px;
      `}>
        {label}
      </span>
    </Button>
  )
}

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
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
          color: ${active
            ? '#303030'
            : '#FFF'
          };
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
          
        `
      )}
    />
  )
)
