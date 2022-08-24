import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { StackTrace } from "./StackTrace";
import './Trace.css';

export type TraceProps = {
    data: StackTrace;
    threshold?: number;
    highlight?: number;
    showInlineParams?: boolean;
    nameFilter?: string;
    traceId: number;
    visibilityCallback(traceId: number, rowVisibility: boolean): void;
};
export type TraceRef = {
    collapseExpandAll: (collapsed: boolean) => void;
    expandUntilHightlight: () => void;
};

export const Trace = forwardRef((props: TraceProps, ref) => {
    const [collapsed, setCollapsed] = useState(true);
    const [childrenVisibility, setChildrenVisibility] = useState(new Array<boolean>(0));
    const childRefs = useRef<TraceRef[]>([]);

    const { data, threshold, highlight, showInlineParams, nameFilter, visibilityCallback, traceId } = props;

    useImperativeHandle(ref, () => ({
        collapseExpandAll,
        expandUntilHightlight
    }));
    const collapseExpandAll = (collapsed: boolean) => {
        setCollapsed(collapsed);
        setTimeout(() => {
            childRefs.current.forEach(r => r?.collapseExpandAll(collapsed));
        });
    }
    const expandUntilHightlight = () => {
        if (data.duration === undefined || data.duration === -1 || (highlight && data.duration > highlight)) {
            setCollapsed(false);
            setTimeout(() => {
                childRefs.current.forEach(r => r?.expandUntilHightlight());
            });
        }
    }

    let rowClassName = '';
    let displayDuration;
    let isVisible = true;
    let areChildrenVisible = true;
    if (data.duration !== undefined && data.duration !== -1) {
        // Filter out traces under the threshold
        if (threshold && data.duration !== -1 && data.duration < threshold) {
            isVisible = false;
            areChildrenVisible = false; // Don't render to improve performance
        }
        // Highlight traces over highlighted threshold
        if (highlight && data.duration > highlight) rowClassName += 'highlighted';

        displayDuration = `${data.duration} - `;
    } else {
        // Don't show duration when not available
        displayDuration = '';
    }
    // Hide this row if doesn't match the filter
    if (nameFilter && data.name.search(nameFilter) === -1) isVisible = false;
    // But show it if one of its children does
    if (childrenVisibility.includes(true)) isVisible = true;

    const hasParams = (data.input && data.input !== '') || (data.output && data.output !== '');
    const hasChildren = (data.children && data.children.length > 0);

    // Show parameters in the tooltip of the trace
    const tooltip = `input: ${data.input}\noutput: ${data.output}`;

    // Show expand icon if there's children
    let expandIcon;
    if (hasChildren) expandIcon = (collapsed) ? '►' : '▼';

    const handleChildrenVisibility = (childId: number, childVisible: boolean): void => {
        childrenVisibility[childId] = childVisible;
        setChildrenVisibility([...childrenVisibility]);
    };

    // Prepare child elements
    let childTraces;
    if (!collapsed && hasChildren) {
        childTraces = data.children.map((c, i) => {
            const childTraceProps: TraceProps = {
                data: c, threshold, highlight, showInlineParams, nameFilter,
                traceId: i, visibilityCallback: handleChildrenVisibility
            };
            return <Trace ref={(ref: TraceRef) => childRefs.current[i] = ref} key={i} {...childTraceProps}></Trace>
        });
    }

    // Update parent on visibility of this row
    useEffect(() => {
        visibilityCallback(traceId, isVisible);
    }, [isVisible]);

    return (
        <>
            {isVisible && <div className="horizontalFlex">
                <button className="transparentBtn" onClick={() => setCollapsed(!collapsed)} title='Toggle this node'>{expandIcon}</button>
                <button className="transparentBtn" onClick={() => expandUntilHightlight()} title='Expand recursively from here while greater than Highlight'>≫</button>
                <button className="transparentBtn" onClick={() => collapseExpandAll(false)} title='Expand recursively from here'>⋙</button>
                <p
                    className={rowClassName}
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
            {areChildrenVisible && <div style={{ paddingLeft: 20 }}>
                {childTraces}
            </div>}
        </>
    );
});