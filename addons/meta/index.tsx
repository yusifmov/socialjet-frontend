/**
 * Facebook, Instagram and Threads — all connect through a Meta app.
 * PHP side: SocialJet/Accounts/Meta (routes under socialjet/addons/meta/).
 */
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faInstagram, faThreads} from "@fortawesome/free-brands-svg-icons";
import {
    AuthModalPropsType,
    createAccountProvider,
    createPostTemplateSetting,
    OAuthAppModal,
    POST_TEXT_SETTING_KEY,
    settingKey,
    sj,
    STANDARD_POST_TEMPLATES,
} from "@socialjet/sdk";

const metaAuthModal = (provider: 'facebook' | 'instagram' | 'threads', title: string) => (props: AuthModalPropsType) => (
    <OAuthAppModal
        {...props}
        title={title}
        provider={provider}
        appName="Meta"
        docsUrl="https://developers.facebook.com/apps/"
        callbackUrlEndpoint="socialjet/addons/meta/get_callback_url"
        loginUrlEndpoint={provider === 'threads' ? 'socialjet/addons/meta/get_login_url_threads' : 'socialjet/addons/meta/get_login_url'}
        fields={[
            {name: 'client_id', label: 'App ID', placeholder: 'e.g. 1234567890123456'},
            {name: 'client_secret', label: 'App secret', secret: true},
        ]}
    />
);

sj.registerAccountProvider(createAccountProvider({
    slug: 'facebook',
    title: 'Facebook',
    icon: <FontAwesomeIcon icon={faFacebook}/>,
    defaultTypeText: 'Facebook Page',
    AuthModal: metaAuthModal('facebook', 'Add Facebook pages'),
}));
sj.registerSettingsItem(createPostTemplateSetting({
    provider: 'facebook',
    networkName: 'Facebook',
    templates: STANDARD_POST_TEMPLATES,
    defaultValue: 'link_card',
}));

sj.registerAccountProvider(createAccountProvider({
    slug: 'instagram',
    title: 'Instagram',
    icon: <FontAwesomeIcon icon={faInstagram}/>,
    accountTypes: {page_feed: 'Instagram Feed', page_story: 'Instagram Story'},
    AuthModal: metaAuthModal('instagram', 'Add Instagram accounts'),
    // Stories have no caption, so the post text setting doesn't apply.
    supportsSetting: (account, setting, byDefault) =>
        !(account.type === 'page_story' && settingKey(setting) === POST_TEXT_SETTING_KEY) && byDefault,
}));
sj.registerSettingsItem(createPostTemplateSetting({
    provider: 'instagram',
    networkName: 'Instagram',
    templates: STANDARD_POST_TEMPLATES.filter(t => t.slug === 'single_image' || t.slug === 'gallery'),
    defaultValue: 'single_image',
}));

sj.registerAccountProvider(createAccountProvider({
    slug: 'threads',
    title: 'Threads',
    icon: <FontAwesomeIcon icon={faThreads}/>,
    defaultTypeText: 'Threads account',
    AuthModal: metaAuthModal('threads', 'Add Threads accounts'),
}));
sj.registerSettingsItem(createPostTemplateSetting({
    provider: 'threads',
    networkName: 'Threads',
    templates: STANDARD_POST_TEMPLATES,
    defaultValue: 'link_card',
}));
