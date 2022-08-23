import { ChangeEvent, useEffect, useState } from "react";

type Props = {
	defaultValue?: number;
	handleChange: (value?: number) => void;
	label: string;
};

export const NumericInput = ({ defaultValue, handleChange, label }: Props) => {
	const [enabled, setEnabled] = useState(defaultValue !== undefined);
	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		handleChange(effectiveValue());
	}, [value, enabled]);

	function effectiveValue() {
		return (enabled) ? value : undefined;
	};

	return (
		<>
			<label style={{marginRight: '0.25em'}}>{label}</label>
			<label>
				<input type="number" style={{width: '4em', marginRight: '0.25em'}} value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))} />
				ms
			</label>
			<label>
				<input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
				Enabled
			</label>
		</>
	);
};