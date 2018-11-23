import React from "react";
import {
    Container,
    Row,
    Col,
    Card
} from 'reactstrap';

export default function ProfileContainer(props) {
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col lg="8">
                    <Card>
                        {props.children}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}