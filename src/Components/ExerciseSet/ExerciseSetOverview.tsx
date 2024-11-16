import '../TrainingPlanComponentStyle.css';

interface Props {
    uniqueExercise: ListOfUniqueExercisesDetailed;
    id: number;
}

interface ListOfUniqueExercisesDetailed {
    exerciseName: string;
    max?: number;
    sets: number;
    minIntensity: number;
    maxIntensity: number;
}

export const ExerciseSetOverview: React.FC<Props> = ({ uniqueExercise, id }: Props) => {
    return (
        <div className='ExerciseContainer' key={id}>
            <div className='ExerciseData'>{uniqueExercise.exerciseName}</div>
            <div className='ExerciseData'>{uniqueExercise.sets}</div>
            <div className='ExerciseData'>{uniqueExercise.minIntensity}% - {uniqueExercise.maxIntensity}%</div>
        </div>

    )
}