import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

/**
 * Page-header actions render outside the page component, so the header button
 * asks the Accounts page to open its network picker through a window event.
 */
export const ADD_ACCOUNT_EVENT = 'socialjet:add-account';

const AddAccountActionButton = () => (
    <Button type="primary" icon={<PlusOutlined/>} onClick={() => window.dispatchEvent(new Event(ADD_ACCOUNT_EVENT))}>
        Add account
    </Button>
);

export default AddAccountActionButton;
