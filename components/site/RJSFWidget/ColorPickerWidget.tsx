import { HexColorPicker } from "react-colorful";

export const ColorPickerWidget = ({ value, onChange }: any) => {
  return (
    <div className="my-2">
      <HexColorPicker color={value || "#000000"} onChange={onChange} />
      <div className="mt-2 text-sm">{value}</div>
    </div>
  );
};
