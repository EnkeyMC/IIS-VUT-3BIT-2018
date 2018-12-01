import CardContainer from "./CardContainer";
import {CardBody, CardHeader, Container} from "reactstrap";
import React from "react";
import PatchForm from "./PatchForm";


export default function PatchCreate() {
    return (
        <div className="ticket-info content-height">
            <Container className="mb-5">
                <CardContainer>
                    <CardHeader className="h4">
                        Create new patch
                    </CardHeader>
                    <CardBody>
                        <PatchForm />
                    </CardBody>
                </CardContainer>
            </Container>
        </div>
    );
}

