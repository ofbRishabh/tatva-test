import React from "react";

export function ImageUploaderWidget({ value, onChange }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center space-x-4">
          <img
            src={value}
            alt="Preview"
            className="h-16 w-16 object-contain border rounded"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-red-500 text-sm underline"
          >
            Remove
          </button>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}
