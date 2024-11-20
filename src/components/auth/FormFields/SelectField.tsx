// src/components/auth/FormFields/SelectField.tsx
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Label } from "@/components/ui/label";
  import { SelectFieldProps } from "@/types/auth";
  
  export function SelectField({
    id,
    label,
    value,
    error,
    options,
    onChange,
  }: SelectFieldProps) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id} className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }