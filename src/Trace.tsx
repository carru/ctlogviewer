import { StackTrace } from "./StackTrace";

type Props = {
    data: StackTrace | undefined;
    threshold: number | undefined;
    highlight: number | undefined;
};

const STYLE_NORMAL = {
    color: 'black'
};
const STYLE_HIGHLIGHTED = {
    color: 'red'
};

export const Trace = ({ data, threshold, highlight }: Props) => {
    if (!data) return <></>;

    let style = STYLE_NORMAL;

    if (data.duration !== undefined) {
        if (threshold && data.duration !== -1 && data.duration < threshold) return <></>;

        if (highlight && data.duration > highlight) style = STYLE_HIGHLIGHTED;
    }

    let children;
    if (data.children) {
        children = data.children.map((c, i) => <Trace key={i} data={c} threshold={threshold} highlight={highlight}></Trace>);
    }

    return (
        <>
            <p style={style}>{data.duration} {data.name}</p>
            <div style={{ paddingLeft: 20 }}>
                {children}
            </div>
        </>
    );
}