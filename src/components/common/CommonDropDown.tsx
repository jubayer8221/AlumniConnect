import React, { useEffect, useMemo, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  type SxProps,
  type Theme,
} from "@mui/material";

export interface IMenuItem {
  label: string | React.ReactNode;
  value: string | number | boolean | null;
  disabled?: boolean;
  group?: string;
}
const SELECT_ALL_VALUE = "__all__";

interface CommonDropDownProps<T extends FieldValues> {
  name?: Path<T>;
  label: string;
  control?: Control<T>;
  menuItems: IMenuItem[];
  value?: string | number | boolean | null;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  multiple?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  sx?: SxProps<Theme>;
  loading?: boolean;
  resetOnDisabled?: boolean;
  onOpen?: () => Promise<void> | void;
  onChange?: (value: string) => void;
}

/* ---------- inner component (needed because hooks can't live in Controller's render) ---------- */

interface InnerProps<T extends FieldValues> extends Omit<
  CommonDropDownProps<T>,
  "control" | "name"
> {
  field?: ControllerRenderProps<T, Path<T>>;
  fieldState?: ControllerFieldState;
}

function DropDownInner<T extends FieldValues>({
  field,
  fieldState,
  label,
  menuItems,
  value: controlledValue,
  placeholder,
  required,
  disabled,
  readOnly,
  multiple = false,
  helperText,
  fullWidth = true,
  size = "small",
  sx,
  loading = false,
  resetOnDisabled = false,
  onOpen,
  onChange,
}: InnerProps<T>) {
  const [localLoading, setLocalLoading] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [open, setOpen] = useState(false);

  const isLoading = localLoading || loading;
  const value = field?.value ?? controlledValue;

  // Reset value when disabled
  useEffect(() => {
    if (disabled && resetOnDisabled && value) {
      field?.onChange("");
      onChange?.("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, resetOnDisabled]);

  const selectedValues = useMemo(
    () => (typeof value === "string" ? value.split(",").filter(Boolean) : []),
    [value],
  );

  const handleOpen = async () => {
    if (disabled || readOnly) return;

    if (hasOpened || !onOpen) {
      setOpen(true);
      return;
    }

    try {
      setLocalLoading(true);
      setOpen(false); // don't open until data has loaded
      await onOpen();
      setHasOpened(true);
      setOpen(true);
    } catch (err) {
      console.error("Error loading dropdown data:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  const options = useMemo<IMenuItem[]>(() => {
    if (isLoading) return [];

    const isAllSelected =
      multiple &&
      menuItems.length > 0 &&
      menuItems.every((m) => selectedValues.includes(String(m.value)));

    return multiple && menuItems.length > 1
      ? [
          {
            value: SELECT_ALL_VALUE,
            label: isAllSelected ? "Deselect All" : "Select All",
          },
          ...menuItems,
        ]
      : menuItems;
  }, [menuItems, isLoading, multiple, selectedValues]);

  const autocompleteValue = multiple
    ? menuItems.filter((m) => selectedValues.includes(String(m.value)))
    : (menuItems.find((m) => String(m.value) === String(value ?? "")) ?? null);

  const commit = (next: string) => {
    field?.onChange(next);
    onChange?.(next);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: unknown) => {
    if (disabled || readOnly || isLoading) return;

    if (!multiple) {
      commit(String((newValue as IMenuItem | null)?.value ?? ""));
      return;
    }

    const selected = newValue as IMenuItem[];
    const allValues = menuItems.map((m) => String(m.value));

    if (selected.some((s) => s.value === SELECT_ALL_VALUE)) {
      const isAllSelected =
        allValues.length > 0 &&
        allValues.length === selectedValues.length &&
        allValues.every((v) => selectedValues.includes(v));

      commit(isAllSelected ? "" : allValues.join(","));
      return;
    }

    commit(selected.map((s) => String(s.value)).join(","));
  };

  return (
    <Autocomplete<IMenuItem, boolean, false, false>
      multiple={multiple}
      options={options}
      freeSolo={false}
      size={size}
      fullWidth={fullWidth}
      open={open}
      onOpen={handleOpen}
      onClose={() => {
        if (!isLoading) setOpen(false);
      }}
      disabled={disabled}
      readOnly={readOnly}
      loading={isLoading}
      noOptionsText={isLoading ? "Loading..." : "No options"}
      isOptionEqualToValue={(option, val) =>
        String(option.value) === String(val.value)
      }
      getOptionLabel={(option) => String(option.label)}
      renderOption={(props, option) => {
        const { key, ...rest } =
          props as React.HTMLAttributes<HTMLLIElement> & {
            key?: string;
          };
        return (
          <li {...rest} key={String(option.value)}>
            {option.label}
          </li>
        );
      }}
      value={autocompleteValue}
      onChange={handleChange}
      onBlur={field?.onBlur}
      sx={sx}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={field?.ref}
          name={field?.name}
          label={label}
          placeholder={placeholder}
          required={required}
          size={size}
          error={!!fieldState?.error}
          helperText={fieldState?.error ? fieldState.error.message : helperText}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps?.input,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                  ) : null}
                  {params.slotProps?.input?.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}

/* ---------- public component ---------- */

export default function CommonDropDown<T extends FieldValues>({
  name,
  control,
  ...rest
}: CommonDropDownProps<T>) {
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <DropDownInner field={field} fieldState={fieldState} {...rest} />
        )}
      />
    );
  }

  return <DropDownInner {...rest} />;
}
