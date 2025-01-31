import React from 'react';
import { Container, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Error from "../components/Error";
import {Link} from "react-router-dom";


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

export function Spinner(props) {
    return (
        <FontAwesomeIcon className="text-muted" icon="spinner" size={props.size} spin/>
    );
}

export function StateRenderer(props) {
    if (props.state.loading) {
        if (props.renderLoading)
            return props.renderLoading(props);
        return (
            <div className="flex-mid mt-4">
                <Spinner size="2x" />
            </div>
        );
    }

    if (props.state.error) {
        if (props.renderError)
            return props.renderError(props);
        return (
            <div className="flex-mid mt-3 mb-3">
                <Error>
                    {props.state.error}
                </Error>
            </div>
        );
    }

    if (props.renderCondition === false)
        return null;

    if (typeof props.children === 'function')
        return props.children(props.state);
    return props.children;
}

export function appendToPath(path, append) {
    if (!path.endsWith('/'))
        path += '/';
    return path + append;
}

export function ConditionView(props) {
    if (props.if)
        return props.children;
    if (props.render)
        return props.render;
    if (props.else)
        return props.else;
    return null;
}

export function EntityAction(props) {
    const {className, children, icon, linkTo, ...rest} = props;
    const Tag = linkTo ? Link : "span";
    return (
        <Tag to={linkTo} {...rest} className={"btn btn-link p-0 mr-3 " + className}>
            {icon ?
                <><FontAwesomeIcon icon={icon}/>&nbsp;</>
                :
                null
            }
            {children}
        </Tag>
    )
}