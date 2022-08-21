import { useState } from 'react'
import { NumericInput } from './NumericInput';
import { busCodeListToJsonString, xmlToBusCodeList } from './Parser';
import { StackTrace } from './StackTrace';
import { Trace } from './Trace';
import './App.css';

function App() {
	const [data, setData] = useState<StackTrace>();
	const [threshold, setThreshold] = useState<number | undefined>();
	const [highlight, setHighlight] = useState<number | undefined>();

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
		<div id="app">
			<div id="settings" className='horizontalFlex'>
				<input type="file" onChange={(e) => loadFile(e.target.files![0])} />
				<div>
					<NumericInput defaultValue={10} handleChange={setThreshold} label="Threshold"></NumericInput>
				</div>
				<div>
					<NumericInput defaultValue={200} handleChange={setHighlight} label="Highlight"></NumericInput>
				</div>
			</div>
			<div id='traces'>
				<Trace data={data} threshold={threshold} highlight={highlight}></Trace>
			</div>
		</div>
	)
}

export default App
