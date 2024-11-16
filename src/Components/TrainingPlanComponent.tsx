import React, { useEffect, useState } from 'react';
import './TrainingPlanComponentStyle.css';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseSetDetailed } from './ExerciseSet/ExerciseSetDetailed';
import { ExerciseSetColumnNames } from './ExerciseSet/ExerciseSetColumnNames';
import { ExerciseSetOverview } from './ExerciseSet/ExerciseSetOverview';

interface Props {
    displayDetailtedData: boolean;
    trainingList: ExerciseSet[];
    areFieldsEditable: boolean;
    setListOfUniqueExercisesParent: (newListOfUniqueExercises: ListOfUniqueExercises[]) => void;
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

interface ListOfUniqueExercises {
    exerciseName: string;
    max?: number;
}

interface ListOfUniqueExercisesDetailed extends ListOfUniqueExercises {
    sets: number;
    minIntensity: number;
    maxIntensity: number;
}

const TrainingPlanComponent: React.FC<Props> = ({ displayDetailtedData, trainingList, areFieldsEditable, setListOfUniqueExercisesParent, setTrainingList }: Props) => {

    const [listOfUniqueExercises, setListOfUniqueExercises] = useState<ListOfUniqueExercisesDetailed[]>([]);

    useEffect(() => {
        if (trainingList) {
            const uniqueExercises: ListOfUniqueExercisesDetailed[] = Object.values(trainingList.reduce((result, exerciseSet: ExerciseSet) => {
                const intensity: number = exerciseSet.maxWeight === 0 ? 100 : Math.round((exerciseSet.weight / exerciseSet.maxWeight) * 100);
                if (!result[exerciseSet.exerciseName]) {
                    result[exerciseSet.exerciseName] = {
                        exerciseName: exerciseSet.exerciseName,
                        sets: 1,
                        minIntensity: intensity,
                        maxIntensity: intensity,
                        max: exerciseSet.maxWeight
                    };
                }
                else {
                    const min: number = result[exerciseSet.exerciseName].maxIntensity > intensity ? intensity : result[exerciseSet.exerciseName].maxIntensity;
                    const max: number = result[exerciseSet.exerciseName].maxIntensity < intensity ? intensity : result[exerciseSet.exerciseName].maxIntensity;
                    result[exerciseSet.exerciseName] = {
                        exerciseName: exerciseSet.exerciseName,
                        sets: result[exerciseSet.exerciseName].sets + 1,
                        minIntensity: min,
                        maxIntensity: max,
                        max: exerciseSet.maxWeight
                    };
                }
                return result;
            }, {} as { [key: string]: ListOfUniqueExercisesDetailed }));
            setListOfUniqueExercises(uniqueExercises);
            setListOfUniqueExercisesParent(uniqueExercises.map(exercise => ({
                exerciseName: exercise.exerciseName,
                max: exercise.max
            })));
        }
    }, [trainingList]);

    const removeRecordById = (id: number) => {
        const index = trainingList?.findIndex(exercise => exercise.id === id);
        if (typeof index === 'number' && index !== -1 && trainingList) {
            const updatedTrainingList: ExerciseSet[] = [...trainingList];
            updatedTrainingList.splice(index, 1);
            setTrainingList(updatedTrainingList);
        }
    }

    return (
        <div className="TrainingDayContainer">
            <ExerciseSetColumnNames
                displayDetailtedData={displayDetailtedData}
            />
            <SortableContext
                items={trainingList}
                strategy={verticalListSortingStrategy}
            >

                {trainingList && displayDetailtedData && trainingList.map((set: ExerciseSet) => (
                    <ExerciseSetDetailed
                        set={set}
                        areFieldsEditable={areFieldsEditable}
                        removeRecordById={removeRecordById}
                        id={set.id}
                        key={set.id}
                        trainingList={trainingList}
                        setTrainingList={setTrainingList}
                    />
                ))}
            </SortableContext>

            {listOfUniqueExercises && !displayDetailtedData && listOfUniqueExercises.map((uniqueExercise: ListOfUniqueExercisesDetailed, index: number) => (
                <ExerciseSetOverview
                    uniqueExercise={uniqueExercise}
                    id={index}
                />
            ))}
        </div>
    );
}

export default TrainingPlanComponent;