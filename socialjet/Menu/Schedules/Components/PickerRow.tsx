import {ReactNode} from "react";
import {Checkbox, Flex, Typography, theme} from "antd";

/** One selectable row in the post/account pickers: the whole row toggles the checkbox. */
function PickerRow(props: {
    selected: boolean
    onToggle: () => void
    media: ReactNode
    title: ReactNode
    meta?: ReactNode
    extra?: ReactNode
    disabled?: boolean
}) {
    const {token} = theme.useToken();

    return (
        <Flex
            role="checkbox"
            aria-checked={props.selected}
            aria-disabled={props.disabled}
            tabIndex={props.disabled ? -1 : 0}
            align="center"
            gap={12}
            onClick={() => !props.disabled && props.onToggle()}
            onKeyDown={e => {
                if (!props.disabled && (e.key === ' ' || e.key === 'Enter')) {
                    e.preventDefault();
                    props.onToggle();
                }
            }}
            style={{
                padding: '10px 12px',
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${props.selected ? token.colorPrimaryBorder : 'transparent'}`,
                background: props.selected ? token.colorPrimaryBg : undefined,
                cursor: props.disabled ? 'not-allowed' : 'pointer',
                opacity: props.disabled ? 0.55 : 1,
                transition: 'background .15s, border-color .15s',
                outline: 'none',
            }}
            className="sj-picker-row"
        >
            <Checkbox checked={props.selected} disabled={props.disabled} tabIndex={-1} style={{pointerEvents: 'none'}}/>
            <div style={{flexShrink: 0}}>{props.media}</div>
            <Flex vertical style={{minWidth: 0, flex: 1}}>
                <Typography.Text strong ellipsis>{props.title}</Typography.Text>
                {props.meta && <Typography.Text type="secondary" style={{fontSize: 12}} ellipsis>{props.meta}</Typography.Text>}
            </Flex>
            {props.extra && <div style={{flexShrink: 0}} onClick={e => e.stopPropagation()}>{props.extra}</div>}
        </Flex>
    );
}

export default PickerRow;
