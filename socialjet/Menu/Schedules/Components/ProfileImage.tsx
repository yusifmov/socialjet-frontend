import { AccountType } from "../../../Types/AccountType.ts";
import { useState } from "react";
import {Avatar, Badge, Image, Tooltip} from "antd";
import {sj} from "../../../SocialJet.ts";
import {CloseCircleOutlined} from "@ant-design/icons";

type ProfileImageProps = {
    account: AccountType,
    showTitleTooltip?: boolean,
    showTitle?: boolean,
    active?: boolean,
    showCloseIcon?: boolean,
    onClose?: () => void,
    tooltipOverNetworkIcon?: boolean,
};

const ProfileImage = ({
    account,
    showCloseIcon = false,
    onClose = () => void 0,
    active = false,
}: ProfileImageProps) => {
    //const { account } = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [hover, setHover] = useState<boolean>(false);

    const initials = account.title
        .split(/\s+/, 3)
        .map(word => word.charAt(0))
        .join('');

    const activeStyle = {
        border: '2px solid #1677ff',
    }

    return (
        <Badge
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            showZero={false}
            count={showCloseIcon && hover
                ? <CloseCircleOutlined onClick={onClose}
                                       style={{
                                           color: "red",
                                           backgroundColor: "white",
                                           borderRadius: "50%"
                                       }}
                />
                : 0}
            offset={[-3, 10]}
        >
            <div style={{ position: 'relative', width: 40, height: 40 }}>
                <Tooltip title={account.title}>
                    {!visible && (
                        <Image
                            width={'40px'}
                            height={'40px'}
                            style={{ borderRadius: '50%', ...active ? activeStyle : {} }}
                            src={account.picture}
                            onError={() => setVisible(true)}
                        />
                    )}

                    {visible && (
                        <Avatar style={{ width: 40, height: 40, ...active ? activeStyle : {} }}>
                            {initials}
                        </Avatar>
                    )}
                </Tooltip>

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
        </Badge>
    );
}

export default ProfileImage;
