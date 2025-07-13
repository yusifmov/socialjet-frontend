import {Node, nodeInputRule, NodeViewProps} from '@tiptap/core'
import {NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {FC, useState} from "react";
import {sj} from "../../SocialJet.ts";
import {Button, Modal} from "antd";
import {SettingOutlined} from "@ant-design/icons";

interface PostTextTagNodeType {
    params: Record<string, string>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        text_tag: {
            addTag: (options: PostTextTagNodeType) => ReturnType
        }
    }
}

export const MyTagView: FC<NodeViewProps> = (props) => {
    const tag = sj.getPostTag(props.node.attrs.params.type)
    const [open, setOpen] = useState(false)

    const openModal = () => setOpen(true)
    const closeModal = () => setOpen(false)

    return (
        <NodeViewWrapper as="span">
            <Button icon={<SettingOutlined />} onClick={() => {
                if(tag.settingsView) {
                    openModal();
                }
            }}>
                {tag.title}
            </Button>

            <Modal
                open={open}
                title={`Edit ${tag.title}`}
                onCancel={closeModal}
                destroyOnClose
                footer={[
                    <Button key="done" type="primary" onClick={closeModal}>
                        Done
                    </Button>,
                ]}
            >
                {
                    tag.settingsView && <tag.settingsView
                    params={props.node.attrs.params}
                    setParams={(p: any) => props.updateAttributes({ params: p })}
                  />
                }
            </Modal>
        </NodeViewWrapper>
    )
}

const TextTagNode = Node.create<PostTextTagNodeType>({
    name: 'post_tag',

    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            params: { default: {} },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="text_tag"]',
                getAttrs: (element) => {
                    const params = element.getAttribute('data-params')
                    return {
                        params: params ? JSON.parse(params) : {}
                    }
                }
            }
        ]
    },

    renderHTML({ HTMLAttributes, node }) {
        return [
            'span',
            {
                'data-type': 'text_tag',
                'data-params': JSON.stringify(node.attrs.params || {}),
                contenteditable: 'false',
                ...HTMLAttributes
            },
            '{post_tag}'
        ];
    },

    renderText({ node }) {
        const attrs = node.attrs.params ?? {}

        const attrString = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ')

        return `{post_tag${attrString ? ' ' + attrString : ''}}`
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: /(\{post_tag(?:\s+([^\}]+))?\})$/,
                type: this.type,
                getAttributes: (match) => {
                    const attrsString = match[1] ?? ''
                    const attrs: Record<string, any> = {}

                    const regex = /(\w+)="([^"]+)"/g
                    let m
                    while ((m = regex.exec(attrsString)) !== null) {
                        const key = m[1]
                        const value = m[2]
                        attrs[key] = value
                    }

                    return { params: attrs }
                },
            }),
        ]
    },

    addCommands() {
        return {
            addTag:
                (options: PostTextTagNodeType) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(MyTagView);
    },
});

export default TextTagNode;