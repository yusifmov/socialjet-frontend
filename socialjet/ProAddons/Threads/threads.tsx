import ThreadsPostTemplates from "./Settings/ThreadsPostTemplates.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThreads} from "@fortawesome/free-brands-svg-icons";
import AuthModal from "../../Addons/Meta/Shared/AuthModal.tsx";
import {sj} from "../../SocialJet.ts";
import PostTextSetting from "../../SettingItems/Items/PostSettings/PostTextSetting.tsx";

sj.registerAccountProvider({
    slug: 'threads',
    title: 'Threads',
    description: 'Threads',
    picture: <FontAwesomeIcon icon={faThreads}></FontAwesomeIcon>,
    AuthModal: (props) => <AuthModal
        open={props.open}
        setOpen={props.setOpen}
        title = 'Add Threads accounts'
        provider = 'threads'
    />,
    getAccountTypeText: () => {
        return 'Threads account'
    },
    supportsSetting: (account, setting) => {
        return (
            setting.targets.includes(account.provider) ||
            [
                PostTextSetting.slug
            ].includes(setting.slug)
        )
    },
    getPostTemplates: () => []
});

sj.registerSettingsItem(ThreadsPostTemplates);