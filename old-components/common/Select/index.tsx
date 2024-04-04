import { ChangeEventHandler, FC } from 'react';

type SelectProps = {
  name: string;
  options: { label: string; value: string }[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
  label?: string;
};

export const Select: FC<SelectProps> = ({
  name,
  options,
  onChange,
  label,
}: SelectProps) => (
  <div className="flex flex-col mb-1">
    {label && (
      <label
        className="text-gray-900 font-medium text-ms 2xl:text-sm"
        htmlFor={name}
      >
        {label}:
      </label>
    )}
    <select
      id={name}
      name={name}
      onChange={onChange}
      className="p-2 border border-gray-400 rounded-sm text-sm text-black font-medium bg-white dark:bg-white uppercase"
    >
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
