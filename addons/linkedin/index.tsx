/** LinkedIn profiles and organization pages. PHP side: SocialJet/Accounts/LinkedIn. */
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {createAccountProvider, createPostTemplateSetting, OAuthAppModal, sj, STANDARD_POST_TEMPLATES} from "@socialjet/sdk";

sj.registerAccountProvider(createAccountProvider({
    slug: 'linkedin',
    title: 'LinkedIn',
    icon: <FontAwesomeIcon icon={faLinkedin}/>,
    accountTypes: {page: 'LinkedIn Page', account: 'LinkedIn Account'},
    AuthModal: (props) => (
        <OAuthAppModal
            {...props}
            title="Add LinkedIn account"
            provider="linkedin"
            appName="LinkedIn"
            docsUrl="https://www.linkedin.com/developers/apps"
            callbackUrlEndpoint="socialjet/accounts/linkedin/get_callback_url"
            loginUrlEndpoint="socialjet/accounts/linkedin/get_login_url"
            fields={[
                {name: 'client_id', label: 'Client ID'},
                {name: 'client_secret', label: 'Client secret', secret: true},
                {
                    name: 'enable_organizations',
                    label: 'Also connect organization pages',
                    type: 'switch',
                    help: 'Needs the Community Management API product approved for your LinkedIn app. Leave off to connect your personal profile only.',
                },
            ]}
        />
    ),
}));

sj.registerSettingsItem(createPostTemplateSetting({
    provider: 'linkedin',
    networkName: 'LinkedIn',
    templates: STANDARD_POST_TEMPLATES,
    defaultValue: 'link_card',
}));
