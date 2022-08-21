import { ChangeEvent, useEffect, useState } from "react";

type Props = {
	defaultValue: number | undefined;
	handleChange: (value: number | undefined) => void;
	label: string;
};

export const NumericInput = ({ defaultValue, handleChange, label }: Props) => {
	const [enabled, setEnabled] = useState(defaultValue !== undefined);
	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		console.log('useEffect');
		handleChange(effectiveValue());
	})

	function effectiveValue() {
		return (enabled) ? value : undefined;
	};

	return (
		<>
			<label>{label}</label>
			<label>
				<input type="number" value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))} />
				ms
			</label>
			<label>
				<input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
				Enabled
			</label>
		</>
	);
};