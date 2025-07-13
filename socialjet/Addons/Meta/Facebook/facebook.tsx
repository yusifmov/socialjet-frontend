import {sj} from "../../../SocialJet.ts";
import AuthModal from "../Shared/AuthModal.tsx";

sj.registerAccountProvider({
    slug: 'facebook',
    title: 'Facebook',
    description: 'Facebook',
    picture: <></>,
    AuthModal: (props) => <AuthModal open={props.open} setOpen={props.setOpen} title = 'Add Facebook accounts' provider = 'facebook' />,
    supportsSetting: _ => true,
    getPostTemplates: _ => []
});