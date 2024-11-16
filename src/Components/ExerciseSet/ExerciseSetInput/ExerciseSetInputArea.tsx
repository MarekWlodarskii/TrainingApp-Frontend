interface Props {
    areFieldsEditable: boolean;
    setIsDragingDisabled: (isDragingDisabled: boolean) => void;
    inputValue: string;
    inputFilter: (inputContent: string) => void;
    inputFocusLost?: () => void;
}

export const ExerciseSetInputArea: React.FC<Props> = ({ areFieldsEditable, setIsDragingDisabled, inputValue, inputFilter, inputFocusLost }: Props) => {
    return (
        <textarea
            className="ExerciseName ExerciseInputArea"
            style={!areFieldsEditable ? { border: "none" } : {}}
            disabled={!areFieldsEditable}
            onMouseEnter={() => setIsDragingDisabled(true)}
            onMouseLeave={() => setIsDragingDisabled(false)}
            value={inputValue}
            onChange={(e) => { inputFilter(e.target.value) }}
            onBlur={inputFocusLost}
            onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.currentTarget.blur();
                    event.preventDefault(); // Zablokuj domyślne działanie Enter
                }
            }}
            rows={4} // Ustaw liczbę wyświetlanych linii
        />
    )
}