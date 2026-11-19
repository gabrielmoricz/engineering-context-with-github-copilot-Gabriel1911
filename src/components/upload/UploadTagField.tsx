"use client";

import { useState } from "react";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

type UploadTagFieldProps = {
  availableTags: readonly string[];
};

export function UploadTagField({ availableTags }: UploadTagFieldProps) {
  const [value, setValue] = useState("");

  return (
    <TagAutocomplete
      availableTags={availableTags}
      label="Tags separadas por vírgula"
      onChange={setValue}
      value={value}
    />
  );
}