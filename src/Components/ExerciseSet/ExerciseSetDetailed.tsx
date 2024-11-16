import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import './ExerciseSetStyle.css';
import { ExerciseSetInput } from './ExerciseSetInput/ExerciseSetInput';
import { ExerciseSetButton } from './ExerciseSetInput/ExerciseSetButton';
import { MAX_WEIGHT, MAX_REPS } from '../StaticValues/ExerciseSetValues';
import { ExerciseSetInputArea } from "./ExerciseSetInput/ExerciseSetInputArea";

interface Props {
    set: ExerciseSet;
    areFieldsEditable: boolean;
    removeRecordById: (idToDelete: number) => void;
    id: number;
    trainingList: ExerciseSet[];
    setTrainingList: (newTrainingList: ExerciseSet[]) => void;
}

interface ExerciseSet {
    id: number;
    exerciseName: string;
    date: Date;
    weight: number;
    reps: number;
    feedback?: string;
    maxWeight: number;
}

export const ExerciseSetDetailed: React.FC<Props> = ({ set, areFieldsEditable, removeRecordById, id, trainingList, setTrainingList }: Props) => {

    const [isDragingDisabled, setIsDragingDisabled] = useState<boolean>(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: isDragingDisabled });
    const style = { transition, transform: CSS.Transform.toString(transform) };
    const [weightInput, setWeightInput] = useState<string>(set.weight.toString());
    const [repsInput, setRepsInput] = useState<string>(set.reps.toString());
    const [feedbackInput, setFeedbackInput] = useState<string>(set.feedback ? set.feedback : "");

    useEffect(() => {
        const updateTrainingSet = (): void => {
            const updatedList = trainingList.map(s => {
                if (set.id === s.id) {
                    return {
                        ...s,
                        weight: parseFloat(weightInput),
                        reps: parseInt(repsInput),
                        feedback: feedbackInput
                    }
                }
                return s;
            });

            setTrainingList(updatedList);
        }

        updateTrainingSet();
    }, [weightInput, repsInput, feedbackInput]);

    const weightInputFilter = (weight: string): void => {
        const regex = new RegExp(`^\\d*\\.?\\d{0,2}$`, 'i');
        if (regex.test(weight)) {
            if (parseInt(weight) > MAX_WEIGHT) {
                setWeightInput(MAX_WEIGHT.toString());
                return;
            }
            setWeightInput(weight);
        }
    }

    const weightInputFocusLost = (): void => {
        if (weightInput === '') {
            setWeightInput('0');
            return;
        }
        const weight = Math.floor(parseFloat(weightInput) / 2.5) * 2.5;
        console.log(weight);
        setWeightInput(weight.toString());
    }

    const setNewWeight = (addOrSubstractWeight: boolean): void => {
        const weight = Math.floor(parseFloat(weightInput) / 2.5) * 2.5;
        addOrSubstractWeight === true ? setWeightInput((weight + 2.5).toString()) : weight >= 2.5 ? setWeightInput((weight - 2.5).toString()) : setWeightInput('0');
        if (addOrSubstractWeight) {
            if (weight >= MAX_WEIGHT) {
                setWeightInput(MAX_WEIGHT.toString());
                return;
            }
            setWeightInput((weight + 2.5).toString());
        } else {
            if (weight >= 2.5) {
                setWeightInput((weight - 2.5).toString());
                return;
            }
            setWeightInput('0');
        }
    }

    const repsInputFilter = (reps: string): void => {
        const regex = new RegExp(`^([1-9][0-9]*|)$`, 'i');
        if (regex.test(reps)) {
            if (parseInt(reps) > MAX_REPS) {
                setRepsInput(MAX_REPS.toString());
                return;
            }
            setRepsInput(reps);
        }
    }

    const repsInputFocusLost = (): void => {
        if (repsInput === '') {
            setRepsInput('1');
            return;
        }
        setRepsInput(repsInput.toString());
    }

    const setNewReps = (addOrSubstractReps: boolean): void => {
        const reps = parseInt(repsInput);
        if (addOrSubstractReps) {
            if (reps >= MAX_REPS) {
                setRepsInput(MAX_REPS.toString());
                return;
            }
            setRepsInput((reps + 1).toString());
        } else {
            if (reps > 1) {
                setRepsInput((reps - 1).toString());
                return;
            }
            setRepsInput('1');
        }
    }

    const feedbackInputFilter = (feedback: string): void => {
        if (feedback.length <= 100){
            setFeedbackInput(feedback);
        }
    }
    

    return (
        <div
            className='ExerciseContainer'
            key={set.id}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
        >
            <div
                className='ExerciseData'

            >
                {set.exerciseName}

            </div>

            <div className='ExerciseData'>
                {areFieldsEditable &&
                    <ExerciseSetButton
                        setIsDragingDisabled={setIsDragingDisabled}
                        addOrSubstract={false}
                        buttonLogic={setNewWeight}
                    />
                }
                <ExerciseSetInput
                    areFieldsEditable={areFieldsEditable}
                    setIsDragingDisabled={setIsDragingDisabled}
                    inputValue={weightInput}
                    inputFilter={weightInputFilter}
                    inputFocusLost={weightInputFocusLost}
                />

                {areFieldsEditable &&
                    <ExerciseSetButton
                        setIsDragingDisabled={setIsDragingDisabled}
                        addOrSubstract={true}
                        buttonLogic={setNewWeight}
                    />
                }
            </div>

            <div className='ExerciseData'>
                {areFieldsEditable &&
                    <ExerciseSetButton
                        setIsDragingDisabled={setIsDragingDisabled}
                        addOrSubstract={false}
                        buttonLogic={setNewReps}
                    />
                }
                <ExerciseSetInput
                    areFieldsEditable={areFieldsEditable}
                    setIsDragingDisabled={setIsDragingDisabled}
                    inputValue={repsInput}
                    inputFilter={repsInputFilter}
                    inputFocusLost={repsInputFocusLost}
                />

                {areFieldsEditable &&
                    <ExerciseSetButton
                        setIsDragingDisabled={setIsDragingDisabled}
                        addOrSubstract={true}
                        buttonLogic={setNewReps}
                    />
                }
            </div>
            <div className='ExerciseData'>{set.maxWeight === 0 ? "100" : Math.round(set.weight / set.maxWeight * 100)}%</div>
            <div className='ExerciseData'>
                <ExerciseSetInputArea
                    areFieldsEditable={areFieldsEditable}
                    setIsDragingDisabled={setIsDragingDisabled}
                    inputValue={feedbackInput}
                    inputFilter={feedbackInputFilter}
                />
            </div>
            <div className='ExerciseData'>
                <button
                    onClick={() => { removeRecordById(set.id) }}
                    onMouseEnter={() => setIsDragingDisabled(true)}
                    onMouseLeave={() => setIsDragingDisabled(false)}
                >
                    Zlituj sie, usun
                </button>
            </div>
        </div>
    )
};