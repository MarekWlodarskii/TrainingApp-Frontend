import '../ExerciseSetStyle.css';

interface Props {
    areFieldsEditable: boolean;
    setIsDragingDisabled: (isDragingDisabled: boolean) => void;
    inputValue: string;
    inputFilter: (inputContent: string) => void;
    inputFocusLost?: () => void;
}

export const ExerciseSetInput: React.FC<Props> = ({ areFieldsEditable, setIsDragingDisabled, inputValue, inputFilter, inputFocusLost }: Props) => {
    return (
        <input
            className="ExerciseName"
            style={!areFieldsEditable ? { border: "none" } : {}}
            disabled={!areFieldsEditable}
            onMouseEnter={() => setIsDragingDisabled(true)}
            onMouseLeave={() => setIsDragingDisabled(false)}
            value={inputValue}
            onChange={(e) => { inputFilter(e.target.value) }}
            onBlur={inputFocusLost}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.currentTarget.blur();
                }
            }}
        >
        </input>
    )
}