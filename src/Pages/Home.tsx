import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Example{
    id: number;
    example: string;
}

function Exam() {

    const [data, setData] = useState<Example[] | null>(null);

    useEffect(() => {
        axios.get<Example[]>(`http://localhost:8080/example`)
            .then(response => {
                console.log("1");
                setData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych z backendu:', error);
            });
    }, []);

    return (
        <div>
            {data != null ? data.map((e, index) => (<div>{e.example}</div>)) : "Brak danych"}
        </div>
    );
}

export default Exam;