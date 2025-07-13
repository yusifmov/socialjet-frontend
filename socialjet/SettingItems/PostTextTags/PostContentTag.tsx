import {ChangeEvent, FC, useState} from "react";
import {PostTagType} from "../../Types/PostTagType.ts";

const PostContentTagSettingView: FC<{params: Record<string, string>, setParams: (params: Record<string, string>) => void}> = (props) => {
    const[p, setP] = useState(props.params);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setP({...p, length: e.target.value})
        props.setParams({...p, length: e.target.value})
    }

    return <span>
        <input onChange={onChange} type={"number"} value={parseInt(p['length'])}/>
    </span>
}

export const PostContentTag: PostTagType = {
    slug: 'post_content',
    title: "Post Content",
    description: "Post Content",
    defaultParams: {
        'type': 'post_content',
        'length': '50'
    },
    settingsView: PostContentTagSettingView
}
