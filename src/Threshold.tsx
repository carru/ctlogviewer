import { ChangeEvent, useState } from "react";

type Props = {
	notifyThresholdChange: (threshold: number) => void;
};

export const Threshold = ({ notifyThresholdChange }: Props) => {
	const [checked, setChecked] = useState(true);
	const [threshold, setThreshold] = useState(10);

	function onChangeCheckbox() {
		setChecked(!checked);
		notifyThresholdChange(effectiveThreshold());
	};

	function onChangeThreshold(e: ChangeEvent<HTMLInputElement>) {
		setThreshold(Number(e.target.value));
		notifyThresholdChange(effectiveThreshold());
	};

	function effectiveThreshold() {
		return (checked) ? threshold : 0;
	};

	return (
		<>
			<label>Threshold</label>
			<label>
				<input type="number" value={threshold} onChange={onChangeThreshold} />
				ms
			</label>
			<label>
				<input type="checkbox" checked={checked} onChange={onChangeCheckbox} />
				Enabled
			</label>
		</>
	);
};