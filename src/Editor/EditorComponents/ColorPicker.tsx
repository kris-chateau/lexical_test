import { css } from "@emotion/css";
import React, { FormEvent } from "react";

type ColorPickerProps = {
  onColor: (colorHex: string) => void;
  getColorValue: () => string;
  defaultColor: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Reusable color input with callbacks. getColorValue is called at each render to set input value.
 * Can be used for any color select needs (backgroundColor, color, borderColor etc...)
 * 
 * @param {ColorPickerProps} props 
 * @returns Controlled color picker input
 */
function ColorPicker(props: ColorPickerProps) {

  function onInput(e: FormEvent<HTMLInputElement>) {
    const value = (e.target as HTMLInputElement).value;
    if (!value) return;
    props.onColor(value);
  }

  return (
    <div>
      <input
        type="color"
        onInput={onInput}
        value={props.getColorValue()}
        className={props?.className}
        style={props?.style}
        id={props?.id}
      />
      <div role="button"
        onClick={() => props.onColor(props.defaultColor)}
        className={css`
          background-color: #CCCCCC;
          text-align: center;
          border-radius: 4px;
          line-height: 1.1em;
          margin-top: 5px;
          padding-top: 3px;
          padding-bottom: 3px;
          font-size: 11px;
          &:hover {
            cursor: pointer;
          }
          &:active {
            background-color: #AAA;
          }
        `}
      >
        RESET
      </div>
    </div>
  )
}

export default ColorPicker;
