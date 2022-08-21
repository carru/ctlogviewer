import { XMLParser } from "fast-xml-parser";
import { BusCode } from "./BusCode";

export function xmlToBusCodeList(xml: string): [BusCode] {
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
	processed = processed.replaceAll(/"/gm, '&quot;');
	// Add quotes to attributes (those already with equal sign)
	processed = processed.replaceAll(/^(\w*=)(.*)$/gm, '$1"$2"');
	// Add quotes to attributes (those with a colon)
	processed = processed.replaceAll(/^(\w*):(.*)$/gm, '$1="$2"');

	return processed;
}

export function busCodeListToJsonString(list: [BusCode]): string {
	const len = list.length;
	const BATCH_SIZE = 100;
	let batches: [string?] = [];

	let json = '';
	let lastChar = '';
	list.forEach((buscode, i) => {
		lastChar = json.slice(-1);
		if (!(i % BATCH_SIZE)) {
			// console.log(`${i + 1}/${len}`);
			batches.push(json);
			json = '';
		}

		if (buscode.START) {
			if (lastChar === '}') json = `${json},`;
			json = `${json}{"name":"${buscode.method}","children":[`;
		} else {
			const duration = (buscode.duration) ? buscode.duration : -1;
			json = `${json}],"duration":${duration}}`;
		}
	});
	json = `${json}]}`;
	batches.push(json);

	return batches.join('');
}
