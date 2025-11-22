import {sj} from "../../../SocialJet.ts";
import AuthModal from "../Shared/AuthModal.tsx";
import FacebookPostTemplates from "./Settings/FacebookPostTemplates.tsx";
import PostTextSetting from "../../../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook} from "@fortawesome/free-brands-svg-icons";

sj.registerAccountProvider({
    slug: 'facebook',
    title: 'Facebook',
    description: 'Facebook',
    picture: <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>,
    AuthModal: (props) => <AuthModal open={props.open} setOpen={props.setOpen} title = 'Add Facebook accounts' provider = 'facebook' />,
    getAccountTypeText: () => {
        return 'Facebook Page'
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

sj.registerSettingsItem(FacebookPostTemplates);