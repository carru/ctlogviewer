import { useEffect, useState } from "react";

type Props = {
	defaultValue: boolean;
	handleChange: (value: boolean) => void;
	label: string;
};

export const CheckboxInput = ({ defaultValue, handleChange, label }: Props) => {
	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		handleChange(value);
	}, [value]);

	return (
		<>
			<label>
				<input type="checkbox" checked={value} onChange={() => setValue(!value)} />
				{label}
			</label>
		</>
	);
};