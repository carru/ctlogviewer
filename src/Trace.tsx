import { useState } from "react";
import { StackTrace } from "./StackTrace";
import './Trace.css';

type Props = {
    data: StackTrace | undefined;
    threshold: number | undefined;
    highlight: number | undefined;
    showInlineParams: boolean | undefined;
};

export const Trace = ({ data, threshold, highlight, showInlineParams }: Props) => {
    const [collapsed, setCollapsed] = useState(false);

    if (!data) return <></>;

    let className = '';
    let displayDuration;
    if (data.duration !== undefined && data.duration !== -1) {

        // Filter out traces under the threshold
        if (threshold && data.duration !== -1 && data.duration < threshold) return <></>;

        // Highlight traces over highlighted threshold
        if (highlight && data.duration > highlight) className += 'highlighted';

        displayDuration = `${data.duration} - `;
    } else {
        // Don't show duration when not available
        displayDuration = '';
    }

    // Show parameters in the tooltip of the trace
    let tooltip = `input: ${data.input}\noutput: ${data.output}`;

    let hasParams = (data.input) || (data.output);

    let children;
    if (!collapsed && data.children) {
        children = data.children.map((c, i) => <Trace key={i} data={c} threshold={threshold} highlight={highlight} showInlineParams={showInlineParams}></Trace>);
    }

    return (
        <>
            <div className="horizontalFlex">
                <button className="transparentBtn" onClick={() => setCollapsed(!collapsed)}>{(collapsed) ? '►' : '▼'}</button>
                <p
                    className={className}
                    onClick={() => setCollapsed(!collapsed)}
                    title={tooltip}>

                    <b>{displayDuration}</b>{data.name}
                </p>
                {showInlineParams && hasParams &&
                    <div className="params verticalFlex">
                        <p className="params">input: {data.input}</p>
                        <p className="params">output: {data.output}</p>
                    </div>
                }
            </div>
            <div style={{ paddingLeft: 20 }}>
                {children}
            </div>
        </>
    );
}