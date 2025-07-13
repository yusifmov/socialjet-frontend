import {useState} from "react";
import PostPickerModal from "../Components/PostPickerModal";

function usePostPickerModal() {
    const [open, setOpen] = useState(false);
    const [zIndex, setZIndex] = useState(1500);

    return {
        modal: <PostPickerModal zIndex={zIndex} open={open} setOpen={setOpen} />,
        setOpen: setOpen,
        setZIndex: setZIndex,
    }
}

export default usePostPickerModal;