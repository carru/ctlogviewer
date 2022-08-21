import { useState } from 'react'
import { busCodeListToJsonString, xmlToBusCodeList } from './Parser';
import { StackTrace } from './StackTrace';
import { Threshold } from './Threshold';
import { Trace } from './Trace';

function App() {
	const [data, setData] = useState<StackTrace>();
	const [threshold, setThreshold] = useState(10);

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
			<Threshold notifyThresholdChange={setThreshold}></Threshold>
			<Trace data={data} threshold={threshold}></Trace>
		</div>
	)
}

export default App
