import Modal from 'react-modal';

interface Props {
    modalIsOpen: boolean;
    closeModal: () => void;
    saveTrainingDay: (changeDay: boolean) => Promise<boolean>;
    changeDate: (newDate: Date, changeOneDay?: number) => void;
    selectedDate: Date;
    changedDate: number;
}

export const SaveChangesInTrainingDay: React.FC<Props> = ({modalIsOpen, closeModal, saveTrainingDay, changeDate, selectedDate, changedDate}: Props) => {
    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                className='Modal'
                overlayClassName='Overlay'
                ariaHideApp={false}
            >
                <h2>
                    Plan uległ zmianie. Czy chcesz zapisać zmiany?
                </h2>
                <button
                    onClick={() => {saveTrainingDay(true); closeModal()}}
                >
                    Tak
                </button>
                <button
                    onClick={() => {changeDate(selectedDate, changedDate); closeModal()}}
                >
                    Nie
                </button>
            </Modal>
        </div>
    )
}