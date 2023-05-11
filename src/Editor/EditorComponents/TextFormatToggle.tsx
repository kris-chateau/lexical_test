import { css, cx } from "@emotion/css"
import React, { Ref } from "react"
import { PropsWithChildren } from "react"
import { useSlate } from "slate-react";
import { CustomText, toggleFormatting } from "../MyEditor";
import { BaseProps } from "./HoveringToolbar";

type FormatButtonProps = {
  format: keyof CustomText;
  label: string;
  isFormatActive: (editor: any, format: string) => boolean;
  toggleFormat: typeof toggleFormatting;
};
export const FormatButton = ({ format, label, isFormatActive, toggleFormat }: FormatButtonProps) => {
  const editor = useSlate();

  return (
    <Button
      active={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
      {label}
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
    return (
      <span
        {...props}
        ref={ref as Ref<HTMLSpanElement>}
        className={cx(
          className,
          css`
            background-color: #c4c4c4;
            font-size: 15px;
            border-radius: 5px;
            font-weight: ${active ? 'bold' : 'normal'};
            cursor: pointer;
            vertical-align: text-bottom;
            padding: 4px;
            color: #303030;
          &:active {
            opacity: 0.6;
            background-color: #8e8e8e;
          }  
          `
        )}
      />
    )
  }
)
