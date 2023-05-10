import React from "react";
import { useSlate } from "slate-react";
import { getFormatValue, toggleFormatting } from "../MyEditor";

type ColorPickerProps = {
  toggleFormat: typeof toggleFormatting;
} & React.InputHTMLAttributes<HTMLInputElement>

function ColorPicker(props: ColorPickerProps) {
  const editor = useSlate();

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const selectedColor = (e.target as HTMLInputElement).value;

    if (!selectedColor) return;

    console.log('selected color: ', selectedColor);
    props.toggleFormat(editor, 'color', selectedColor);
    console.log('Format Value', getFormatValue(editor, 'color'));
    console.log(editor)
  }
  console.log('Format Value', getFormatValue(editor, 'color'));

  let formatArray = getFormatValue(editor, 'color');
  let colorValue: string = "#000000";
  if (Array.isArray(formatArray) && formatArray.length && formatArray[0]?.color) {
    colorValue = formatArray[0]?.color;
  }
  
  return (
    <input
      type="color"
      onInput={onInput}
      value={colorValue}
      className={props?.className}
      style={props?.style}
      id={props?.id}
    />
  )
}

export default ColorPicker;
