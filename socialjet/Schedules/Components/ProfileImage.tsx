import { AccountType } from "../../Types/AccountType.ts";
import { useState } from "react";
import { Avatar, Image } from "antd";

function ProfileImage(props: { account: AccountType }) {
    const { account } = props;
    const [visible, setVisible] = useState<boolean>(false);

    const initials = account.title
        .split(/\s+/, 3)
        .map(word => word.charAt(0))
        .join('');

    return (
        <>
            {!visible && (
                <Image width={'40px'} height={'40px'} style={{borderRadius: '50%'}}
                    src={account.picture}
                    onError={() => setVisible(true)}
                />
            )}
            {visible && (
                <Avatar style={{width:"40px", height:"40px"}}>{initials}</Avatar>
            )}
        </>
    );
}

export default ProfileImage;
