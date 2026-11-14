/** Pinterest boards. PHP side: SocialJet/Accounts/Pinterest. */
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPinterest} from "@fortawesome/free-brands-svg-icons";
import {createAccountProvider, createPostTemplateSetting, OAuthAppModal, sj} from "@socialjet/sdk";

sj.registerAccountProvider(createAccountProvider({
    slug: 'pinterest',
    title: 'Pinterest',
    icon: <FontAwesomeIcon icon={faPinterest}/>,
    accountTypes: {board: 'Pinterest board'},
    AuthModal: (props) => (
        <OAuthAppModal
            {...props}
            title="Add Pinterest boards"
            provider="pinterest"
            appName="Pinterest"
            docsUrl="https://developers.pinterest.com/apps/"
            callbackUrlEndpoint="socialjet/accounts/pinterest/get_callback_url"
            loginUrlEndpoint="socialjet/accounts/pinterest/get_login_url"
            fields={[
                {name: 'app_id', label: 'App ID'},
                {name: 'app_secret_key', label: 'App secret key', secret: true},
            ]}
        />
    ),
}));

sj.registerSettingsItem(createPostTemplateSetting({
    provider: 'pinterest',
    networkName: 'Pinterest',
    templates: [
        {slug: 'single_image', title: 'Single image', description: 'one pin with the featured image'},
        {slug: 'gallery', title: 'Gallery', description: 'a carousel pin with the post images'},
    ],
    defaultValue: 'single_image',
}));
