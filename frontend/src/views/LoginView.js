import React from 'react';
import AuthLayout from './layouts/AuthLayout';
import {
    Col,
    Card,
    CardBody, Form, FormGroup, Label, Input, Button
} from 'reactstrap';
import {Link} from "react-router-dom";

export default class LoginView extends React.Component {
    render() {
        return (
            <AuthLayout>
                <Col md="5">
                    <Card className="p-4">
                        <CardBody>
                            <h1>Login</h1>
                            <p className="text-muted">Login to your account</p>
                            <Form>
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <Input name="username" id="username" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input name="password" id="password" />
                                </FormGroup>
                                <Button color="primary">Login</Button>
                            </Form>
                            <p className="mt-4">Do not have an account, yet? <Link to="/register">Register here!</Link></p>
                        </CardBody>
                    </Card>
                </Col>
            </AuthLayout>
        );
    }
}