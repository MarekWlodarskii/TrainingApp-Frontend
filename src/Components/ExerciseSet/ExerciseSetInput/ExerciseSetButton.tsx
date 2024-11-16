import '../ExerciseSetStyle.css';

interface Props {
    setIsDragingDisabled: (isDragingDisabled: boolean) => void;
    addOrSubstract: boolean;
    buttonLogic: (addOrSubstract: boolean) => void;
}

export const ExerciseSetButton: React.FC<Props> = ({ setIsDragingDisabled, addOrSubstract, buttonLogic }: Props) => {
    return (
        <button
            className="ExerciseButton"
            onMouseEnter={() => setIsDragingDisabled(true)}
            onMouseLeave={() => setIsDragingDisabled(false)}
            onClick={() => { buttonLogic(addOrSubstract) }}
        >
            {addOrSubstract ? "+" : "-"}
        </button>
    )
}