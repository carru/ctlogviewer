import { FC } from "react";
import Tree from "react-animated-tree";
import { StackTrace } from "./StackTrace";

export const Trace: FC<{ data: StackTrace | undefined }> = (props) => {
    if (!props.data) return <></>;

    const duration = props.data.duration;
    if (duration && duration !== -1 && duration < 10) return <></>;

    let children;
    if (props.data.children) {
        children = props.data.children.map(c =>
            <>

                <Trace data={c}></Trace>
            </>
        );
    }

    // const content = `${props.data.duration} ${props.data.name}`;
    // return (
    //     <Tree content={content} >
    //         {children}
    //     </Tree>
    // );

    return (
        <>
            <p>{props.data.duration} {props.data.name}</p>
            <div style={{ paddingLeft: 20 }}>
                {children}
            </div>
        </>
    );
}