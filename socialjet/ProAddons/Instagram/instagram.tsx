import {sj} from "../../SocialJet.ts";
import AuthModal from "../../Addons/Meta/Shared/AuthModal.tsx";
import PostTextSetting from "../../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import InstagramPostTemplates from "./Settings/InstagramPostTemlates.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram} from "@fortawesome/free-brands-svg-icons";

sj.registerAccountProvider({
    slug: 'instagram',
    title: 'Instagram',
    description: 'Instagram',
    getAccountTypeText: (accountOrTypeKey) => {
        let type;

        if(typeof accountOrTypeKey === "string"){
            type = accountOrTypeKey;
        }
        else {
            type = accountOrTypeKey.type;
        }

        if(type === 'page_feed'){
            return 'Instagram Feed'
        }

        if(type === 'page_story'){
            return 'Instagram Story'
        }

        return 'Instagram'
    },
    picture: <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>,
    AuthModal: (props) => <AuthModal open={props.open} setOpen={props.setOpen} title = 'Add Instagram pages' provider = 'instagram' />,
    supportsSetting: (account, setting) => {
        if(
            setting.slug === PostTextSetting.slug &&
            account.type === 'page_story'
        ) return false;

        return setting.targets.includes(account.provider) ||
            [
                PostTextSetting.slug
            ].includes(setting.slug);
    },
    getPostTemplates: () => []
});

sj.registerSettingsItem(InstagramPostTemplates);