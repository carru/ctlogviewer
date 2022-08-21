import { XMLParser } from "fast-xml-parser";
import { BusCode } from "./BusCode";
import { StackTrace } from "./StackTrace";

export function parseXml(xml: string): StackTrace {
	const busCodes = xmlToBusCodeList(xml);
	const jsonString = busCodeListToJsonString(busCodes);
	return JSON.parse(jsonString);
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

	// Escape quotes
	// processed = processed.replaceAll(/"/gm, '&quot;');
	processed = processed.replaceAll(/"/gm, ''); // Remove them instead; json parser doesn't like it
	// Remove control characters
	// processed = processed.replaceAll(/[[:cntrl:]]/gm, '');
	processed = processed.replaceAll(/[,,,]/gm, '');

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
			json = `${json}{"name":"${buscode.method}","input":"${buscode.In}","children":[`;
		} else {
			depth--;
			const duration = (buscode.duration) ? buscode.duration : -1;
			json = `${json}],"output":"${buscode.Out}","duration":${duration}}`;
		}
	});

	// Somehow, main trace is not always closed. This is kind of a hack
	json += ']}'.repeat(depth);

	batches.push(json);

	return batches.join('');
}
