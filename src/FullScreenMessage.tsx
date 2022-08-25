import './FullScreenMessage.css';

type Props = {
    label: string;
};

export const FullScreenMessage = ({ label }: Props) => {
    const lines = label.split('\n');
    return (
        <div className='fullScreenMessage'>
            {lines.map((l, i) => <p key={i}>{l}<br></br><br></br></p>)}
        </div>
    );
};