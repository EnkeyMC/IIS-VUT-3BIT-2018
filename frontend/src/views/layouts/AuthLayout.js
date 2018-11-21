import React from 'react';

import { Container, Row } from 'reactstrap';
// import {Link} from "react-router-dom";

export default function AuthLayout(props) {
    return (
        <Container className="h-100 d-flex">
            {/*<div className="flex-mid fixed-top">*/}
                {/*<Link to="/">ZeroBugs</Link>*/}
            {/*</div>*/}
            <Row className="justify-content-center align-self-center flex-fill">
                {props.children}
            </Row>
        </Container>
    );
}