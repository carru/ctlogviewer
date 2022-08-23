import { useRef, useState } from 'react'
import { NumericInput } from './NumericInput';
import { parseXml } from './Parser';
import { StackTrace } from './StackTrace';
import { Trace, TraceProps, TraceRef } from './Trace';
import './App.css';
import { CheckboxInput } from './CheckboxInput';
import { LoadingMask } from './LoadingMask';

const filterByNameHelp = `Records not currently visible are discarded to improve performance (e.g. those filtered by Threashold).
For this reason, the filter by name functionality does not work on records that are not already visible.
You can get strange behaviour also by filtering and then toggling records. 'Expand All' helps in these cases.`;

function App() {
	const [data, setData] = useState<StackTrace>();
	const [threshold, setThreshold] = useState<number | undefined>();
	const [highlight, setHighlight] = useState<number | undefined>();
	const [showInlineParams, setShowInlineParams] = useState<boolean>();
	const [loading, setLoading] = useState(false);
	const [nameFilter, setNameFilter] = useState('');
	const stackTraceRef = useRef<TraceRef>(null);

	function loadFile(f: File) {
		if (!f) return;

		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = (e.target?.result);
			if (!text) return;

			setData(parseXml(text as string));
			setLoading(false);
		};
		reader.readAsText(f);
		setLoading(true);
	}

	let traceElement;
	if (data) {
		let traceProps: TraceProps = { data, threshold, highlight, showInlineParams, nameFilter, traceId: 0, visibilityCallback: () => { } };
		traceElement = (
			<div id='traces'>
				<Trace ref={stackTraceRef} {...traceProps}></Trace>
			</div>
		);
	}

	return (
		<div id="app">
			{loading && <LoadingMask />}
			<div id="settings" className='horizontalFlex'>
				<input type="file" onChange={(e) => loadFile(e.target.files![0])} />
				<button onClick={() => stackTraceRef.current?.collapseExpandAll(false)}>Expand All</button>
				<button onClick={() => stackTraceRef.current?.collapseExpandAll(true)}>Collapse All</button>
				<div>
					<input type="search" placeholder='Filter by name' onChange={e => setNameFilter(e.target.value)} />
					<button onClick={() => alert(filterByNameHelp)}>?</button>
				</div>
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
			{traceElement}
		</div>
	)
}

export default App
