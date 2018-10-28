import React from 'react';

import { Container, Row } from 'reactstrap';

export default function AuthLayout(props) {
    return (
        <Container className="h-100 d-flex">
            <Row className="justify-content-center align-self-center flex-fill">
                {props.children}
            </Row>
        </Container>
    );
}