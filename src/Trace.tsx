import { forwardRef, PropsWithChildren, useImperativeHandle, useRef, useState } from "react";
import { StackTrace } from "./StackTrace";
import './Trace.css';

export type TraceProps = {
    data: StackTrace;
    threshold?: number;
    highlight?: number;
    showInlineParams?: boolean;
    parentCollapsed?: boolean;
};
export type TraceRef = {
    collapseExpandAll: (collapsed: boolean) => void
};

export const Trace = forwardRef((props: TraceProps, ref) => {
    useImperativeHandle(ref, () => ({
        collapseExpandAll(collapsed: boolean) {
            setCollapsed(collapsed);
            childRefs.current.forEach(r => r?.collapseExpandAll(collapsed));
        }
    }));

    const [collapsed, setCollapsed] = useState(false);
    const childRefs = useRef<TraceRef[]>([]);

    const { data, threshold, highlight, showInlineParams, parentCollapsed } = props;

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
    if (hasChildren) {
        childTraces = data.children.map((c, i) => {
            const childTraceProps: TraceProps = { data: c, threshold, highlight, showInlineParams, parentCollapsed: collapsed };
            return <Trace ref={(ref: TraceRef) => childRefs.current[i] = ref} key={i} {...childTraceProps}></Trace>
        });
    }

    return (
        <>
            {!parentCollapsed && <div className="horizontalFlex">
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
            </div>}
            <div style={{ paddingLeft: 20 }}>
                {childTraces}
            </div>
        </>
    );
});