import { ChangeEvent, useState } from "react";

type Props = {
	defaultValue: number | undefined;
	handleChange: (value: number | undefined) => void;
	label: string;
};

export const NumericInput = ({ defaultValue, handleChange, label }: Props) => {
	const [enabled, setEnabled] = useState(defaultValue !== undefined);
	const [value, setValue] = useState(defaultValue);

	function onChangeEnabled() {
		setEnabled(!enabled);
		handleChange(effectiveValue());
	};

	function onChangeValue(e: ChangeEvent<HTMLInputElement>) {
		setValue(Number(e.target.value));
		handleChange(effectiveValue());
	};

	function effectiveValue() {
		return (enabled) ? value : undefined;
	};

	return (
		<>
			<label>{label}</label>
			<label>
				<input type="number" value={value} onChange={onChangeValue} />
				ms
			</label>
			<label>
				<input type="checkbox" checked={enabled} onChange={onChangeEnabled} />
				Enabled
			</label>
		</>
	);
};