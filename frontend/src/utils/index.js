import React from 'react';
import { Container, Row } from 'reactstrap';

export function copyMerge(obj1, obj2 = null) {
    return Object.assign({}, obj1, obj2);
}

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true});
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex-row align-items-center">
                    <Container>
                        <Row className="justify-content-center">
                            <p>Ooops! Something went wrong!</p>
                        </Row>
                    </Container>
                </div>
            );
        }
        return this.props.children;
    }
}
