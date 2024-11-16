import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TrainingPlanComponent from '../Components/TrainingPlanComponent';
import CalendarComponent from '../Components/CalendarComponent';
import ExerciseSelectionComponent from '../Components/ExerciseSelectionComponent';
import './TrainingPage.css';
import Modal from 'react-modal';
import { closestCorners, DndContext } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { SaveChangesInTrainingDay } from '../Components/Notifications/SaveChangesInTrainingDay';

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

function TrainingPage() {

    const [displayDetailtedData, setDisplayDetailedData] = useState<boolean>(false);
    const [areFieldsEditable, setAreFieldsEditable] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [displayedDate, setDisplayedDate] = useState<string>("");
    const [trainingList, setTrainingList] = useState<ExerciseSet[]>([]);
    const [trainingListOriginallyFetched, setTrainingListOriginallyFetched] = useState<ExerciseSet[]>([]);
    const [listOfUniqueExercises, setListOfUniqueExercises] = useState<ListOfUniqueExercises[]>([]);
    const [changeTrainingDayDate, setChangeTrainingDayDate] = useState<Boolean>(false);
    const [addingSet, setAddingSet] = useState<Boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [dataSaveAlert, setDataSaveAlert] = useState<boolean>(false);
    const [savedDataSuccesfully, setSavedDataSuccesfully] = useState<boolean>(false);
    const [changedDate, setChangedDate] = useState<number>(0);
    const [nextTempId, setNextTempId] = useState<number>(0);

    useEffect(() => {
        const fetchTrainingDay = async () => {
            try {
                const date = formatDate(selectedDate);
                const response = await axios.get('http://localhost:8080/getTrainingDay', {
                    params: { date }
                });
            setTrainingList(response.data);
            setTrainingListOriginallyFetched(response.data);
            } catch (error) {
                console.error('Błąd podczas pobierania danych z backendu: ', error);
            }
        };

        fetchTrainingDay();
        setNextTempId(0);
        setAreFieldsEditable(false);
    }, [selectedDate]);

    useEffect(() => {
        const month = selectedDate.getMonth()+1;
        setDisplayedDate(selectedDate.getDate().toString() + "." + month.toString() + "." + selectedDate.getFullYear());
    }, [selectedDate]);

    const changeDate = (newDate: Date, changeOneDay?: number) => {
        const updatedDate = new Date(newDate);
        if (changeOneDay) {
            updatedDate.setDate(updatedDate.getDate() + changeOneDay);
        }
        setSelectedDate(updatedDate);
    };

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
        setDataSaveAlert(false);
    }

    const saveTrainingDay = async (changeDay: boolean): Promise<boolean> => {
        const trainingListWithModifiedData = trainingList?.map(exercise => ({
            ...exercise,
            date: formatDate(exercise.date)
        }));

        try {
            const response = await axios.post('http://localhost:8080/saveTrainingDay', 
                trainingListWithModifiedData, {
                    params:{
                        date: formatDate(selectedDate)
                    }
            });
            setTrainingList(response.data);
            setTrainingListOriginallyFetched(response.data);
            if(changeDay === true){
                changeDate(selectedDate, changedDate); 
            }
        } catch (error) {
            console.error('Błąd podczas pobierania danych z backendu:', error);
            return false;
        }
        return true;
    }

    const formatDate = (date: Date) => {
        const month = selectedDate.getMonth()+1;
        return selectedDate.getFullYear() + "-" + month.toString().padStart(2, '0') + "-" + selectedDate.getDate().toString().padStart(2, '0');
    }

    const getPosition = (id: number) => {
        return trainingList.findIndex(set => set.id === id);
    }

    const handleDragEnd = (event: any) => {
        const {active, over} = event;

        if(active.id === over.id)
            return;

        const originalPosition = getPosition(active.id);
        const newPosition = getPosition(over.id);

        setTrainingList(arrayMove(trainingList, originalPosition, newPosition));
    }

        const sortExercisesByName = () => {
            const sortedList: ExerciseSet[] = [...trainingList];
            sortedList.sort((a: ExerciseSet, b: ExerciseSet) => {
                const indexA = listOfUniqueExercises?.findIndex(exercise => exercise.exerciseName === a.exerciseName);
                const indexB = listOfUniqueExercises?.findIndex(exercise => exercise.exerciseName === b.exerciseName);

                if(indexA === -1)
                    return 1;
                if(indexB === -1)
                    return -1;
                return indexA-indexB;
            });
            setTrainingList(sortedList);
        }

    return (
        <div 
            className='TrainingPageContainer'
            onClick={() => {if(changeTrainingDayDate)setChangeTrainingDayDate(false); if(addingSet)setAddingSet(false)}}
        >
            <SaveChangesInTrainingDay
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                saveTrainingDay={saveTrainingDay}
                changeDate={changeDate}
                selectedDate={selectedDate}
                changedDate={changedDate}
            />
            
            <Modal
                isOpen={dataSaveAlert}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                className='Modal'
                overlayClassName='Overlay'
                ariaHideApp={false}
            >
                <h2>
                    {savedDataSuccesfully === true ? "Pomyślnie zapisano zmiany." : "Błąd podczas próby zapisu danych."}
                </h2>
                <button
                    onClick={() => {closeModal()}}
                >
                    Ok
                </button>
            </Modal>

            {(changeTrainingDayDate || addingSet) && 
            <div
            className='TransparentBackground'>
                
            </div>}
            <div 
                className='RowContainer'
                style={{marginTop: "3%"}}>
                <button 
                    className='NavigationButton'
                    onClick={() => (setDisplayDetailedData(!displayDetailtedData))}>
                        {displayDetailtedData ? "Mniej szczegółów" : "Pokaż więcej szczegółów"}
                    </button>
            </div>
            <div className='RowContainer'>
                <button 
                    className='NavigationButton'
                    onClick={() => {JSON.stringify(trainingList) === JSON.stringify(trainingListOriginallyFetched) ? changeDate(selectedDate, -1) : openModal(); setChangedDate(-1)}}>
                        Poprzedni dzień
                    </button>
                <button
                    className='NavigationButton'
                    onClick={() => setChangeTrainingDayDate(!changeTrainingDayDate)}>
                        {displayedDate}
                    </button>
                <button 
                    className='NavigationButton'
                    onClick={() => {JSON.stringify(trainingList) === JSON.stringify(trainingListOriginallyFetched) ? changeDate(selectedDate, 1) : openModal(); setChangedDate(1)}}>
                        Następny dzień
                    </button>
            </div>
            <div 
                className='RowContainer'
            >
                <button 
                    className='NavigationButton'
                    onClick={() => {setAreFieldsEditable(!areFieldsEditable)}}>
                        {areFieldsEditable ? "Wyłącz edycje" : "Włącz edycje"}
                    </button>
                <button 
                    className='NavigationButton'
                    onClick={async () => {
                        if(await saveTrainingDay(false)  === true) {
                            setSavedDataSuccesfully(true);
                        } else {
                            setSavedDataSuccesfully(false);
                        }
                        setDataSaveAlert(true);
                        }}>
                        Zapisz dzień
                    </button>
            </div>
            <div 
                className='RowContainer'
                style={{marginBottom: "3%"}}>
                <button 
                    className='NavigationButton'
                    onClick={() => {sortExercisesByName()}}>
                        Posortuj według ćwiczeń
                    </button>
            </div>
            
            {changeTrainingDayDate &&
                <div
                    className='PopUpContainer'
                >
                    <CalendarComponent 
                        date = {selectedDate} 
                        setDate = {setSelectedDate}
                        setChangeTrainingDayDate = {setChangeTrainingDayDate}
                    />
                </div>
            }

            {addingSet &&
                <div
                    className='PopUpContainer'
                >
                    <ExerciseSelectionComponent
                    date={selectedDate}
                    trainingList={trainingList}
                    setTrainingList={setTrainingList}
                    listOfUniqueExercises={listOfUniqueExercises}
                    setListOfUniqueExercises={setListOfUniqueExercises}
                    setAddingSet={setAddingSet}
                    nextTempId={nextTempId}
                    setNextTempId={setNextTempId}
                />
                </div>
            }   

            
            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <TrainingPlanComponent 
                    displayDetailtedData = {displayDetailtedData} 
                    trainingList={trainingList}
                    areFieldsEditable={areFieldsEditable}
                    setListOfUniqueExercisesParent={setListOfUniqueExercises}
                    setTrainingList={setTrainingList}
                />
            </DndContext>
            
            
            <div 
                className='RowContainer'
                style={{marginTop: "1%", minWidth: "100px"}}>
                <button 
                    className='NavigationButton'
                    onClick={() => (setAddingSet(!addingSet))}>
                        +
                    </button>
            </div>
        </div>
    );
}

export default TrainingPage;