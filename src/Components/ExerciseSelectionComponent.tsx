import React, { useEffect, useState } from 'react';
import './ExerciseSelectionComponentStyle.css';
import axios, { AxiosError } from 'axios';
import { type } from '@testing-library/user-event/dist/type';

interface Exercise{
    exerciseName: string;
    exerciseType: string;
}

interface ExerciseSet{
    id: number;
    exerciseName: string;
    date: Date;
    weight: number;
    reps: number;
    feedback?: string;
    maxWeight: number;
}

interface ListOfUniqueExercises{
    exerciseName: string;
    max?: number;
}

interface Props{
    date: Date;
    trainingList: ExerciseSet[] | null;
    setTrainingList: (newTrainingList: ExerciseSet[]) => void;
    listOfUniqueExercises: ListOfUniqueExercises[] | null;
    setListOfUniqueExercises: (newListOfUniqueExercises: ListOfUniqueExercises[]) => void;
    setAddingSet: (newSet: Boolean) => void;
    nextTempId: number;
    setNextTempId: (newNextTempId: number) => void;
}

const ExerciseSelectionComponent: React.FC<Props> = ({date, trainingList, setTrainingList, listOfUniqueExercises, setListOfUniqueExercises, setAddingSet, nextTempId, setNextTempId}: Props) => {

    const [searchBarData, setSearchBarData] = useState<string>('');
    const [exerciseSelectedName, setExerciseSelectedName] = useState<string>('');
    const [weightInput, setWeightInput] = useState<string>('');
    const [repsInput, setRepsInput] = useState<string>('');
    const [feedbackInput, setFeedbackInput] = useState<string>('');
    const [exerciseList, setExerciseList] = useState<Exercise[] | null>(null);
    const [isExerciseSelected, setIsExerciseSelected] = useState<Boolean>(false);

    useEffect(() => {
        const fetchExerciseList = async () => {
            try {
                const response = await axios.get('http://localhost:8080/getExerciseList', {
                });
            setExerciseList(response.data);

            } catch (error) {
                console.error('Błąd podczas pobierania danych z backendu:', error);
            }
        };
        fetchExerciseList();
    }, []);

    function HandleExerciseFilter(exercise: string){
        const regex = new RegExp(`.*${searchBarData}.*`, 'i');

        if(regex.test(exercise)){
            return true;
        }
        return false;
    }

    const saveNewSet = async () =>{
        const maxWeightForSelectedExercise: number = await getMaxForSelectedExercise(exerciseSelectedName);

        const newExercise: ListOfUniqueExercises = {
            exerciseName: exerciseSelectedName,
            max: maxWeightForSelectedExercise
        }

        if(listOfUniqueExercises !== null){
            const prevListOfUniqueExercises: ListOfUniqueExercises[] = listOfUniqueExercises;
            setListOfUniqueExercises([...prevListOfUniqueExercises, newExercise]);
        } 
            else {
                setListOfUniqueExercises([newExercise]);
            }

        var newSet: ExerciseSet = {
            id: nextTempId,
            exerciseName: exerciseSelectedName,
            date: date,
            weight: parseInt(weightInput),
            reps: parseInt(repsInput),
            feedback: feedbackInput,
            maxWeight: maxWeightForSelectedExercise
        }

        if(trainingList !== null) {
            setTrainingList([...trainingList, newSet])
        }
        else {
            setTrainingList([newSet]);
        }

        setNextTempId(nextTempId-1);
        setAddingSet(false);
    }

    const getMaxForSelectedExercise = async (name: string): Promise<number> => {
        const exercise = listOfUniqueExercises?.find(exercise => exercise.exerciseName === exerciseSelectedName);
        if(exercise && typeof exercise.max === 'number'){
            return exercise.max;
        }
        return await fetchTrainingMax(name);
    }

    const fetchTrainingMax = async (name: string): Promise<number> => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const respone = await axios.get('http://localhost:8080/getExerciseMax', {
                params: {
                    exerciseName: name,
                    date: formattedDate
                }
            });
            return respone.data;
        }
        catch(error: AxiosError | any) {
            if(error.response && error.response.status === 404) {
                return 0;
            }
            console.log('Blad: ', error.message);
            return 0;
        }
    }

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    return (
        <div 
            className='ExerciseSelectionComponentContainer'
            onClick={(event) => {handleClick(event)}}>
            {!isExerciseSelected && 
            <div
                className='ExerciseSelectionContainer'    
            >
                <input 
                    className='ExerciseSelectionInput'
                    placeholder='Exercise Name' 
                    onChange={(event) => {setSearchBarData(event.target.value)}}
                />
                {exerciseList && exerciseList.map((exercise: Exercise, value: number) => (
                    <div 
                        key={value}>
                        {HandleExerciseFilter(exercise.exerciseName) &&
                            <button
                                className='ExerciseSelectionButton'
                                onClick={() => {setIsExerciseSelected(true); setExerciseSelectedName(exercise.exerciseName)}}>
                                {exercise.exerciseName}
                            </button>
                        }
                    </div>
            ))
            }
            </div>
            }
            {isExerciseSelected &&
            <div
                className='ExerciseSelectionContainer' 
            >
                <div
                    className='ExerciseSelectedName'
                >
                    {exerciseSelectedName}
                </div>
                <input
                    className='ExerciseSelectionInput'
                    placeholder='Weight'
                    onChange={(event) => {setWeightInput(event.target.value)}}
                />
                <input
                    className='ExerciseSelectionInput'
                    placeholder='Reps'
                    onChange={(event) => {setRepsInput(event.target.value)}}
                />
                <input
                    className='ExerciseSelectionInput'
                    placeholder='Feedback'
                    onChange={(event) => {setFeedbackInput(event.target.value)}}
                />
                <button
                    className='ExerciseSelectionButton'
                    onClick={() => {setIsExerciseSelected(false); saveNewSet()}}
                >
                    Zapisz
                </button>
            </div>
            }
        </div>
    );
}

export default ExerciseSelectionComponent;