import React from 'react';
import CardContainer from "./CardContainer";
import {CardBody, CardHeader} from "reactstrap";
import ModuleForm from "./ModuleForm";

export default function ModuleCreate() {
    return (
        <CardContainer>
            <CardHeader className="h4">
                Create new module
            </CardHeader>
            <CardBody>
                <ModuleForm />
            </CardBody>
        </CardContainer>
    );
}
