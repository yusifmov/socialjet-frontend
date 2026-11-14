import {useState} from "react";
import {Avatar, Tooltip, theme} from "antd";
import type {AccountType} from "@socialjet/sdk";
import {sj} from "../../../SocialJet.ts";
import {brand} from "../../theme.ts";

type ProfileImageProps = {
    account: AccountType,
    size?: number,
    active?: boolean,
};

/** Account avatar (falls back to initials) with the network's icon in a corner badge. */
const ProfileImage = ({account, size = 40, active = false}: ProfileImageProps) => {
    const {token} = theme.useToken();
    const [failed, setFailed] = useState<boolean>(false);
    const provider = sj.getAccountProvider(account.provider);

    const initials = account.title
        .split(/\s+/, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join('');

    const badge = Math.max(14, Math.round(size * 0.42));

    return (
        <div style={{position: 'relative', width: size, height: size, flexShrink: 0}}>
            <Tooltip title={account.title}>
                <Avatar
                    size={size}
                    src={!failed && account.picture ? account.picture : undefined}
                    onError={() => {
                        setFailed(true);
                        return false;
                    }}
                    style={{
                        background: brand.gradient,
                        color: '#fff',
                        fontSize: size * 0.38,
                        boxShadow: active ? `0 0 0 2px ${token.colorBgContainer}, 0 0 0 4px ${token.colorPrimary}` : undefined,
                    }}
                >
                    {initials}
                </Avatar>
            </Tooltip>
            <Tooltip title={provider?.title}>
                <div style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: badge,
                    height: badge,
                    borderRadius: '50%',
                    background: brand.navy,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: badge * 0.6,
                    border: `2px solid ${token.colorBgContainer}`,
                    lineHeight: 1,
                }}>
                    {provider?.picture}
                </div>
            </Tooltip>
        </div>
    );
};

export default ProfileImage;
