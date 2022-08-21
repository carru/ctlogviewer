import { useState } from 'react'
import { NumericInput } from './NumericInput';
import { busCodeListToJsonString, xmlToBusCodeList } from './Parser';
import { StackTrace } from './StackTrace';
import { Trace } from './Trace';

function App() {
	const [data, setData] = useState<StackTrace>();
	const [threshold, setThreshold] = useState<number | undefined>(10);
	const [highlight, setHighlight] = useState<number | undefined>(200);

	function loadFile(f: File) {
		if (!f) return;

		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = (e.target?.result);
			if (!text) return;

			const nodes = xmlToBusCodeList(text as string);
			const jsonString = busCodeListToJsonString(nodes);
			const jsonObj = JSON.parse(jsonString);
			setData(jsonObj);
		};
		reader.readAsText(f);
	}

	return (
		<div className="App">
			<input type="file" onChange={(e) => loadFile(e.target.files![0])} />
			<NumericInput defaultValue={threshold} handleChange={setThreshold} label="Threshold"></NumericInput>
			<NumericInput defaultValue={highlight} handleChange={setHighlight} label="Highlight"></NumericInput>
			<Trace data={data} threshold={threshold} highlight={highlight}></Trace>
		</div>
	)
}

export default App
