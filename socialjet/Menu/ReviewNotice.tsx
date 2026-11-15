import React, {useEffect, useState} from 'react';
import {Alert, Button, Flex} from 'antd';
import {apiFetch} from "@socialjet/sdk";

const REVIEW_URL = 'https://wordpress.org/support/plugin/socialjet/reviews/#new-post';

type NoticeState = { show: boolean, shared_count?: number };
type DismissAction = 'later' | 'never' | 'reviewed';

/**
 * "Rate SocialJet" notice: the backend decides when it shows (after a few days of use
 * and a few successful shares) and remembers dismissals per user.
 */
const ReviewNotice: React.FC = () => {
    const [state, setState] = useState<NoticeState | null>(null);

    useEffect(() => {
        apiFetch<undefined, NoticeState>('socialjet/review_notice/get')
            .then(setState)
            .catch(() => setState(null));
    }, []);

    if (!state?.show) return null;

    const dismiss = (action: DismissAction) => {
        setState(null);
        apiFetch('socialjet/review_notice/dismiss', {action}).catch(() => undefined);
    };

    return (
        <Alert
            type="info"
            showIcon
            closable
            onClose={() => dismiss('never')}
            style={{marginBottom: 16}}
            message={`SocialJet has shared ${state.shared_count} posts for you. If it saves you time, a quick review on WordPress.org really helps.`}
            action={
                <Flex gap={8} wrap>
                    <Button
                        type="primary"
                        size="small"
                        href={REVIEW_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => dismiss('reviewed')}
                    >
                        Leave a review
                    </Button>
                    <Button size="small" onClick={() => dismiss('later')}>Maybe later</Button>
                    <Button size="small" type="text" onClick={() => dismiss('never')}>Don't ask again</Button>
                </Flex>
            }
        />
    );
};

export default ReviewNotice;
