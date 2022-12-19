import { XMLParser } from "fast-xml-parser";
import { BusCode } from "./BusCode";
import { StackTrace } from "./StackTrace";

export function parseXml(xml: string, name: string): StackTrace {
	// Read XML
	const busCodes = xmlToBusCodeList(xml);

	// Generate JSON string with hierarchy from XML object
	const jsonString = busCodeListToJsonString(busCodes);

	// Create master trace; necessary in case there's multiple traces in the log
	const trace: StackTrace = {
		timestamp: "",
		name,
		input: "",
		output: "",
		duration: 0,
		children: JSON.parse(jsonString)
	};

	// Set duration
	trace.children.forEach(c => trace.duration += c.duration);

	return trace;
}

function xmlToBusCodeList(xml: string): [BusCode] {
	const options = {
		ignoreAttributes: false,
		attributeNamePrefix: "",
		allowBooleanAttributes: true
	};
	const parser = new XMLParser(options);

	const jsonObj = parser.parse(preProcessXml(xml));
	return jsonObj.BusCode;
}

function preProcessXml(raw: string): string {
	let processed = raw;

	// Open BusCode node
	processed = processed.replaceAll(/^<BusCode>$/gm, '<BusCode');
	// Close BusCode node
	processed = processed.replaceAll(/^<\/BusCode>$/gm, '/>');

	/**
	 * Remove all characters other than
	 * 	a-z, A-Z, 0-9, _
	 * 	spaces, line breaks, line feeds
	 * 	<, >, =, :, [, ], ., /
	 */
	processed = processed.replaceAll(/[^\w\r\n <>=:\[\]\./]+/g, '');

	// Add quotes to attributes (those already with equal sign)
	processed = processed.replaceAll(/^(\w*=)(.*)$/gm, '$1"$2"');
	// Add quotes to attributes (those with a colon)
	processed = processed.replaceAll(/^(\w*):(.*)$/gm, '$1="$2"');

	return processed;
}

function busCodeListToJsonString(list: [BusCode]): string {
	const BATCH_SIZE = 100;
	let batches: [string?] = [];

	let json = '';
	let lastChar = '';
	let depth = 0;
	list.forEach((buscode, i) => {
		lastChar = json.slice(-1);
		if (!(i % BATCH_SIZE)) {
			batches.push(json);
			json = '';
		}

		if (buscode.START) {
			depth++;
			if (lastChar === '}') json = `${json},`;
			const input = `"input":"${(buscode.In) ? buscode.In : ''}"`;
			json = `${json}{"name":"${buscode.method}",${input},"children":[`;
		} else {
			depth--;
			const duration = `"duration":${(buscode.duration) ? buscode.duration : -1}`;
			const output = `"output":"${(buscode.Out) ? buscode.Out : ''}"`;
			json = `${json}],${output},${duration}}`;
		}
	});

	// Somehow, main trace is not always closed. This is kind of a hack
	json += ']}'.repeat(depth);

	batches.push(json);

	// Merge batched strings and add [] in case there's multiple traces (processes)
	return `[${batches.join('')}]`;
}
