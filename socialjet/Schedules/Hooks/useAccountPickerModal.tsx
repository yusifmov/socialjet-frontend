import {useState} from "react";
import AccountPickerModal from "../Components/AccountPickerModal";

function useAccountPickerModal() {
    const [open, setOpen] = useState(false);
    const [zIndex, setZIndex] = useState(1500);

    return {
        modal: <AccountPickerModal zIndex={zIndex} open={open} setOpen={setOpen} />,
        setOpen: setOpen,
        setZIndex: setZIndex,
    }
}

export default useAccountPickerModal;