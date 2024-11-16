import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './TrainingPlanComponentStyle.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarComponent.css';

interface Props{
    date: Date;
    setDate: (newDate: Date) => void;
    setChangeTrainingDayDate: (setChangeTrainingDayDate: Boolean) => void;
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarComponent: React.FC<Props> = ({date, setDate, setChangeTrainingDayDate}: Props) => {

    const [value, onChange] = useState<Value>(date);

    useEffect(() =>{
        if(value && !Array.isArray(value)){
            setDate(value);
        }
    }, [value]);

    const handleDateChange = (date: Value) => {
        onChange(date);
        setTimeout(() => {
            setChangeTrainingDayDate(false);
        }, 0);
    }

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    return (
        <div
            onClick={(event) => handleClick(event)}
        >
            <Calendar 
                onChange={handleDateChange} 
                value={value}
                />
        </div>
    );
}

export default CalendarComponent;