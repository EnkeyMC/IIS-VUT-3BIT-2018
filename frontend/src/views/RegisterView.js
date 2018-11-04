import React from 'react';
import AuthLayout from './layouts/AuthLayout';
import {
    Col,
    Card,
    CardBody, Form, FormGroup, Label, Input, Button
} from 'reactstrap';
import {Link} from "react-router-dom";

export default class RegisterView extends React.Component {
    render() {
        return (
            <AuthLayout>
                <Col md="7">
                    <Card className="p-4">
                        <CardBody>
                            <h1>Register</h1>
                            <p className="text-muted">Create new account</p>
                            <Form>
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <Input name="username" id="username" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input type="email" name="email" id="email" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input name="password" id="password" type="password" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password-verify">Verify password</Label>
                                    <Input name="password-verify" id="password-verify" type="password" />
                                </FormGroup>
                                <Button className="mt-3" color="primary">Register</Button>
                                <p className="mt-4">Already have an account? <Link to="/login">Login here!</Link></p>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </AuthLayout>
        );
    }
}