import { StackTrace } from "./StackTrace";
import './Trace.css';

type Props = {
    data: StackTrace | undefined;
    threshold: number | undefined;
    highlight: number | undefined;
};

export const Trace = ({ data, threshold, highlight }: Props) => {
    if (!data) return <></>;

    let className = '';

    if (data.duration !== undefined) {
        if (threshold && data.duration !== -1 && data.duration < threshold) return <></>;

        if (highlight && data.duration > highlight) className += 'highlighted';
    }

    let children;
    if (data.children) {
        children = data.children.map((c, i) => <Trace key={i} data={c} threshold={threshold} highlight={highlight}></Trace>);
    }

    return (
        <>
            <p className={className}>{data.duration} {data.name}</p>
            <div style={{ paddingLeft: 20 }}>
                {children}
            </div>
        </>
    );
}