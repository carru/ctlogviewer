import { StackTrace } from "./StackTrace";

type Props = {
    data: StackTrace | undefined;
	threshold: number;
};

export const Trace = ({ data, threshold }: Props) => {
    if (!data) return <></>;

    const duration = data.duration;
    if (duration && duration !== -1 && duration < threshold) return <></>;

    let children;
    if (data.children) {
        children = data.children.map(c => <Trace data={c} threshold={threshold}></Trace>);
    }

    return (
        <>
            <p>{data.duration} {data.name}</p>
            <div style={{ paddingLeft: 20 }}>
                {children}
            </div>
        </>
    );
}