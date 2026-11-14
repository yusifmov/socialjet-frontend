import {FC} from "react";
import {Provider, useDispatch} from "react-redux";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import store, {AutoPosterDispatch} from "../store.ts";
import {openAutoPosterEditor} from "../Slices/actions.ts";

function ButtonContent() {
    const dispatch = useDispatch<AutoPosterDispatch>();

    return (
        <Button type="primary" icon={<PlusOutlined/>} onClick={() => openAutoPosterEditor(dispatch)}>
            New auto-poster
        </Button>
    );
}

const NewAutoPosterActionButton: FC = () => (
    <Provider store={store}>
        <ButtonContent/>
    </Provider>
);

export default NewAutoPosterActionButton;
