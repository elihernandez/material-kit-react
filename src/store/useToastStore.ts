import { create } from 'zustand'

export enum TOAST_TYPE {
    SUCCESS,
    ERROR
}

interface ToastState {
    type: TOAST_TYPE
    isShowToast: boolean
    toastMessage: string
    setToastMessage: (txt: string) => void
    handleShowToast: (type: TOAST_TYPE, isShowToast: boolean, toastMessage: string) => void
    handleCloseToast: () => void
}

const useToastStore = create<ToastState>()(
    (set) => ({
        type: TOAST_TYPE.SUCCESS,
        isShowToast: false,
        toastMessage: null,
        setToastMessage: (element) => set((state) => ({ ...state, toastMessage: element })),
        handleShowToast: (type, isShowToast, toastMessage) => set((state) => ({ ...state, type: type, isShowToast: isShowToast, toastMessage: toastMessage })),
        handleCloseToast: () => set((state) => ({ ...state, isShowToast: false })),
    })
)

export default useToastStore