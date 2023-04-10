import { create } from 'zustand'

export enum MODAL_OPTIONS {
    CREATE,
    EDIT,
    DELETE,
    LINK,
    DELETE_LINK,
    EMAIL
}

interface ModalState {
    isShowModal: boolean
    modalOption: MODAL_OPTIONS
    modalData: any
    modalBody: JSX.Element | null
    setModalOption: (option: MODAL_OPTIONS) => void
    setModalBody: (element: JSX.Element) => void
    setModalData: (data: any) => void
    handleShowModal: () => void
    handleCloseModal: () => void
    setModalOpen: (data: any, option: MODAL_OPTIONS) => void
}

const useModalStore = create<ModalState>()(
    (set) => ({
        isShowModal: false,
        modalOption: MODAL_OPTIONS.CREATE,
        modalData: null,
        modalBody: null,
        setModalOption: (option) => set((state) => ({ ...state, modalOption: option })),
        setModalBody: (element) => set((state) => ({ ...state, modalBody: element })),
        setModalData: (data) => set((state) => ({ ...state, modalData: data })),
        handleShowModal: () => set((state) => ({ ...state, isShowModal: true })),
        handleCloseModal: () => set((state) => ({ ...state, isShowModal: false })),
        setModalOpen: (data, option) => set((state) => ({ ...state, isShowModal: true, modalData: data, modalOption: option }))
    })
)

export default useModalStore