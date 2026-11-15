import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressBook} from "@fortawesome/free-regular-svg-icons";
import {AccountsMenuPage} from "./AccountsMenuPage.tsx";
import AddAccountActionButton from "./AddAccountActionButton.tsx";

export const MenuItemAccounts = {
    title: "Accounts",
    parent: undefined,
    actions: [
        <AddAccountActionButton/>
    ],
    icon: <FontAwesomeIcon icon={faAddressBook} size={'lg'}/>,
    priority: 0,
    slug: "accounts",
    render: AccountsMenuPage
}