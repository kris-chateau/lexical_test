import React from "react";

type ColorPickerProps = {
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
  getColorValue: () => string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Reusable color input with callbacks. getColorValue is called at each render to set input value.
 * Can be used for any color select needs (backgroundColor, color, borderColor etc...)
 * 
 * @param {ColorPickerProps} props 
 * @returns Controlled color picker input
 */
function ColorPicker(props: ColorPickerProps) {

  return (
    <input
      type="color"
      onInput={props.onInput}
      value={props.getColorValue()}
      className={props?.className}
      style={props?.style}
      id={props?.id}
    />
  )
}

export default ColorPicker;
