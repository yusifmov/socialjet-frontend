import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import LinkedInPostTemplates from "./Settings/LinkedInPostTemplates.tsx";
import {sj} from "../../SocialJet.ts";
import PostTextSetting from "../../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import AuthModal from "./Components/AuthModal.tsx";

sj.registerAccountProvider({
    slug: 'linkedin',
    title: 'LinkedIn',
    description: 'LinkedIn',
    picture: <FontAwesomeIcon icon={faLinkedin}></FontAwesomeIcon>,
    AuthModal: (props) => <AuthModal open={props.open} setOpen={props.setOpen} />,
    getAccountTypeText: (accountOrTypeKey) => {
        let type;

        if(typeof accountOrTypeKey === "string"){
            type = accountOrTypeKey;
        }
        else {
            type = accountOrTypeKey.type;
        }

        if(type === 'page'){
            return 'LinkedIn Page'
        }

        if(type === 'account'){
            return 'LinkedIn Account'
        }

        return 'LinkedIn'
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

sj.registerSettingsItem(LinkedInPostTemplates);