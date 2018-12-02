import CardContainer from "./CardContainer";
import {CardBody, CardHeader, Container} from "reactstrap";
import React from "react";
import BugForm from "./BugForm";


export default function BugCreate() {
    return (
        <div className="info content-height">
            <Container className="mb-5">
                <CardContainer>
                    <CardHeader className="h4">
                        Create new bug
                    </CardHeader>
                    <CardBody>
                        <BugForm />
                    </CardBody>
                </CardContainer>
            </Container>
        </div>
    );
}

