/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { InputHTMLAttributes } from "react";
import {
  UseFormRegister,
  FieldError,
  Path,
  FieldValues,
  DeepMap,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import FormErrorMessage from "../FormErrorMessage";
import { DetailedHTMLProps } from "react";

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "image"
  | "file"
  | "checkbox";

type InputProps = {
  id: string;
  name: string;
  label?: string;
  type?: InputType;
  className?: string;
  iconName?: string;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "size"
>;

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  register: any;
  errors?: Partial<DeepMap<T, FieldError>>;
  disabled?: boolean;
  hasCurrencyPrefix?: boolean;
  required?: boolean;
  checkbox?: boolean;
  min?: string;
  placeholder?: string;
  step?: string;
} & Omit<InputProps, "name">;

const Input = <T extends Record<string, unknown>>({
  id,
  label,
  name,
  type,
  disabled,
  hasCurrencyPrefix = false,
  required,
  register,
  errors,
  iconName,
  min = "",
  placeholder = "Enter something",
  step = "",
}: FormInputProps<T>): JSX.Element => {
  const isCheckbox = type === "checkbox";

  const inputOptions: any = {
    required,
  };

  if (hasCurrencyPrefix) {
    inputOptions.valueAsNumber = true;
    inputOptions.pattern = /^[1-9]\d*$/;
  }

  return (
    <div className={`w-full ${isCheckbox ? "flex items-center" : ""}`}>
      {hasCurrencyPrefix && !isCheckbox && (
        <i
          className={`ri-${iconName} absolute left-2 top-3 z-10 origin-[0] font-light text-slate-400`}
        />
      )}
      <label
        htmlFor={name}
        className={`mb-1 block text-left text-sm font-medium text-gray-900 dark:text-white ${
          hasCurrencyPrefix ? "absolute" : "static"
        } z-10 ${hasCurrencyPrefix ? "left-9" : "left-0"}`}
      >
        {label}
      </label>
      {isCheckbox ? (
        <input
          className={`peer h-5 w-5 cursor-pointer rounded-md border bg-white outline-none transition ${
            disabled ? "cursor-not-allowed opacity-70" : ""
          }`}
          disabled={disabled}
          type={type}
          id={id}
          {...register(name, { required })}
        />
      ) : (
        <input
          className={`peer w-full rounded-md border bg-white p-3 pt-3 font-light outline-none transition ${
            disabled ? "cursor-not-allowed opacity-70" : ""
          } ${hasCurrencyPrefix ? "pl-9" : "pl-4"}`}
          disabled={disabled}
          type={type}
          id={id}
          min={min}
          {...register(name, inputOptions)}
          step={step}
          placeholder={placeholder}
        />
      )}

      <ErrorMessage
        errors={errors}
        name={name as any}
        render={({ message }) => (
          <FormErrorMessage className="mt-1">{message}</FormErrorMessage>
        )}
      />
    </div>
  );
};

export default Input;
