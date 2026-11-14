import {Component, ErrorInfo, ReactNode} from "react";
import {Button, Result} from "antd";

interface Props {
    children: ReactNode
    /** Changing this resets the boundary (e.g. the current page slug). */
    resetKey?: string
}

interface State {
    error: Error | null
    resetKey?: string
}

/**
 * Keeps one broken page or add-on from blanking the whole SocialJet admin screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = {error: null, resetKey: this.props.resetKey};

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {error};
    }

    static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
        if (props.resetKey !== state.resetKey) {
            return {error: null, resetKey: props.resetKey};
        }
        return null;
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[SocialJet] Page crashed:', error, info.componentStack);
    }

    render() {
        if (this.state.error) {
            return (
                <Result
                    status="error"
                    title="Something went wrong on this page"
                    subTitle={this.state.error.message}
                    extra={<Button onClick={() => this.setState({error: null})}>Try again</Button>}
                />
            );
        }
        return this.props.children;
    }
}
