import { useRef } from "react";
import { useSlate } from "slate-react";

type ColorPickerProps = {
  active: boolean;
  onChoice: (color: string) => void;
  toggleFormat: (editor: any, format: string) => void;
}

export default function ColorPicker({ active, onChoice }: ColorPickerProps) {
  const editor = useSlate()
  const inputRef = useRef<HTMLInputElement>(null);

  active && onChoice;

  return (
    <>
      <input type="color" onInput={(val) => console.log(val)} ref={inputRef} />
    </>
  )
}
