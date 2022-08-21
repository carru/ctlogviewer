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

    const hasParams = (data.input) || (data.output);
    const hasChildren = (data.children && data.children.length);

    // Show parameters in the tooltip of the trace if there's any
    let tooltip;
    if (hasParams) tooltip = `input: ${data.input}\noutput: ${data.output}`;

    // Show expand icon if there's children
    let expandIcon;
    if (hasChildren) expandIcon = (collapsed) ? '►' : '▼';

    // Prepare child elements
    let childTraces;
    if (!collapsed && hasChildren) {
        childTraces = data.children.map((c, i) => <Trace key={i} data={c} threshold={threshold} highlight={highlight} showInlineParams={showInlineParams}></Trace>);
    }

    return (
        <>
            <div className="horizontalFlex">
                <button className="transparentBtn" onClick={() => setCollapsed(!collapsed)}>{expandIcon}</button>
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
                {childTraces}
            </div>
        </>
    );
}