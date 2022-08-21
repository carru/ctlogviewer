import { useState } from 'react'
import reactLogo from './assets/react.svg'
// import './App.css'
import { busCodeListToJsonString, xmlToBusCodeList } from './Parser';
import { StackTrace } from './StackTrace';
import { Trace } from './Trace';

function App() {
	const [data, setData] = useState<StackTrace>();

	function loadFile(f: File) {
		if (!f) return;

		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = (e.target?.result);
			if (!text) return;

			const nodes = xmlToBusCodeList(text as string);
			// console.log(nodes);
			const jsonString = busCodeListToJsonString(nodes);
			// console.log(jsonString);
			const jsonObj = JSON.parse(jsonString);
			console.log(jsonObj);
			setData(jsonObj);
		};
		reader.readAsText(f);
	}

	return (
		<div className="App">
			<input type="file" onChange={(e) => loadFile(e.target.files![0])} />
			<Trace data={data}></Trace>
		</div>
	)
}

export default App
