import { useState } from 'react'
import { NumericInput } from './NumericInput';
import { parseXml } from './Parser';
import { StackTrace } from './StackTrace';
import { Trace } from './Trace';
import './App.css';
import { CheckboxInput } from './CheckboxInput';

function App() {
	const [data, setData] = useState<StackTrace>();
	const [threshold, setThreshold] = useState<number | undefined>();
	const [highlight, setHighlight] = useState<number | undefined>();
	const [showInlineParams, setShowInlineParams] = useState<boolean>();

	function loadFile(f: File) {
		if (!f) return;

		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = (e.target?.result);
			if (!text) return;

			setData(parseXml(text as string));
		};
		reader.readAsText(f);
	}

	return (
		<div id="app">
			<div id="settings" className='horizontalFlex'>
				<input type="file" onChange={(e) => loadFile(e.target.files![0])} />
				<div>
					<CheckboxInput defaultValue={false} handleChange={setShowInlineParams} label="Inline Params"></CheckboxInput>
				</div>
				<div>
					<NumericInput defaultValue={10} handleChange={setThreshold} label="Threshold"></NumericInput>
				</div>
				<div>
					<NumericInput defaultValue={200} handleChange={setHighlight} label="Highlight"></NumericInput>
				</div>
			</div>
			<div id='traces'>
				<Trace data={data} threshold={threshold} highlight={highlight} showInlineParams={showInlineParams}></Trace>
			</div>
		</div>
	)
}

export default App
