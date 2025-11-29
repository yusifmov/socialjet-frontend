import { AccountType } from "../../Types/AccountType.ts";
import { useState } from "react";
import {Avatar, Image, Tooltip} from "antd";
import {sj} from "../../SocialJet.ts";

function ProfileImage(props: { account: AccountType }) {
    const { account } = props;
    const [visible, setVisible] = useState<boolean>(false);

    const initials = account.title
        .split(/\s+/, 3)
        .map(word => word.charAt(0))
        .join('');

    return (
        <div style={{ position: 'relative', width: 40, height: 40 }}>
            {!visible && (
                <Image
                    width={'40px'}
                    height={'40px'}
                    style={{ borderRadius: '50%' }}
                    src={account.picture}
                    onError={() => setVisible(true)}
                />
            )}

            {visible && (
                <Avatar style={{ width: 40, height: 40 }}>
                    {initials}
                </Avatar>
            )}

            {/* Bottom-right icon */}
            <Tooltip title={sj.getAccountProvider(account.provider)?.title}>
                <div
                    style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#1677ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 10,
                        border: '2px solid white',
                        cursor: 'pointer'
                    }}
                >
                    {sj.getAccountProvider(account.provider)?.picture}
                </div>
            </Tooltip>
        </div>
    );
}

export default ProfileImage;
