import React from "react";
import { useSlate } from "slate-react";
import { getFormatValue, toggleFormatting } from "../MyEditor";

type ColorPickerProps = {
  toggleFormat: typeof toggleFormatting;
  selectedColor?: string;
} & React.InputHTMLAttributes<HTMLInputElement>

export default function ColorPicker(props: ColorPickerProps) {
  const editor = useSlate();

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const selectedColor = (e.target as HTMLInputElement).value;

    if (!selectedColor) return;

    console.log('selected color: ', selectedColor);
    props.toggleFormat(editor, 'color', selectedColor);
    console.log(getFormatValue(editor, 'color'));
  }

  return (
    <input
      {...props}
      type="color"
      onInput={onInput}
    />
  )
}
