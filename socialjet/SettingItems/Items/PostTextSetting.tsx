import {SettingsItemType} from "../../Types/SettingsItemType";
import {useEffect} from "react";
import {EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import TextTagNode from "../PostTextTags/TextTagNode.tsx";
import {Button, Col, Row, Space} from "antd";
import {sj} from "../../SocialJet.ts";
import SocialPostSettingsProvider from "../Providers/SocialPostSettingsProvider.tsx";

const MyView = (props: {setValue: (value: string) => void, value: string | undefined}) => {
    const {setValue, value} = props;

    const editor = useEditor({
        extensions: [StarterKit, TextTagNode],
        onUpdate: props => {
            setValue(props.editor.getText())
        },
        content: value || '',
    });

    useEffect(() => {
        if(value === undefined){
            //todo set default value?
            setValue('');
        }
    })

    function convertPlaceholdersToNodes(text: string) {
        const regex = /\{post_tag\s+([^}]+)\}/g

        const parts: any[] = []
        let lastIndex = 0

        let match
        while ((match = regex.exec(text)) !== null) {
            const before = text.slice(lastIndex, match.index)
            if (before) parts.push({ type: 'text', text: before })

            const paramString = match[1]
            const params: Record<string, string> = {}
            paramString.split(/\s+/).forEach(pair => {
                const [key, value] = pair.split('=')
                if (key && value) params[key] = value.replace(/^"|"$/g, '')
            })

            parts.push({ type: 'post_tag', attrs: { params } })
            lastIndex = regex.lastIndex
        }

        const after = text.slice(lastIndex)
        if (after) parts.push({ type: 'text', text: after })

        return parts
    }

    useEffect(() => {
        let parts = convertPlaceholdersToNodes(value || '')
        editor?.commands.clearContent();
        editor?.commands.insertContent(parts);
    }, [editor])

    return (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {/* Tags Section */}
            <div>
                <div style={{ marginTop: '6px' }}>
                    <Row gutter={[6, 6]} style={{ flexWrap: 'wrap' }}>
                        {sj.getPostTags().map((tag, index) => (
                            <Col key={index}>
                                <Button
                                    size="small"
                                    onClick={() =>
                                        editor?.chain().focus().addTag({
                                            params: tag.defaultParams || {},
                                        }).run()
                                    }
                                >
                                    {tag.title}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Editor Section */}
            <div>
                <div style={{
                    marginTop: '6px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    minHeight: '120px',
                    textAlign: 'initial',
                }}>
                    <EditorContent
                        editor={editor}
                        style={{ padding: '12px' }}
                    />
                </div>
            </div>
        </Space>
    );
}

const PostTextSetting: SettingsItemType<string> = {
    title: "Post Text",
    slug: "post_text",
    provider: SocialPostSettingsProvider.slug,
    targets: ["schedule"],
    description: "Customize the text content of your social media posts. It applies only if selected posting template supports text",
    priority: 1,
    defaultValue: '{post_tag type="post_title"} {post_tag type="post_link"}',
    render: (props) => <MyView value={props.value} setValue={props.setValue} />,
};

export default PostTextSetting;