interface Props{
    displayDetailtedData: boolean;
}

export const ExerciseSetColumnNames: React.FC<Props> = ({displayDetailtedData}: Props) =>{
    return(
        <div className="ExerciseContainer">
                <div className="ExerciseData">
                    Exercise
                </div>
                <div className="ExerciseData">
                    {displayDetailtedData === true ? "Weight" : "Sets"}
                </div>
                {displayDetailtedData &&
                    <div className="ExerciseData">
                        Reps
                    </div>
                }
                <div className="ExerciseData">
                    Intensity
                </div>
                {displayDetailtedData &&
                    <div className="ExerciseData">
                        Feedback
                    </div>
                }
                {displayDetailtedData &&
                    <div className="ExerciseData">

                    </div>
                }
            </div>
    );
}