import React from 'react';
import AuthLayout from './layouts/AuthLayout';
import {
    Col,
    Card,
    CardBody, FormGroup, Label, Button
} from 'reactstrap';
import {Link} from "react-router-dom";
import { Form, Input } from "../components/Form";

export default class LoginView extends React.Component {
    render() {
        return (
            <AuthLayout>
                <Col lg="5">
                    <Card className="p-4">
                        <CardBody>
                            <h1>Login</h1>
                            <p className="text-muted">Login to your account</p>
                            <LoginForm/>
                            <p className="mt-4">Do not have an account, yet? <Link to="/register">Register here!</Link></p>
                        </CardBody>
                    </Card>
                </Col>
            </AuthLayout>
        );
    }
}

class LoginForm extends React.Component {
    render () {
        return (
            <Form id="login">
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input name="username" id="username" />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    {<Input name="password" id="password" type="password" />}
                </FormGroup>
                <FormGroup>
                    <Button type="submit" color="primary" className="w-100 mt-4">Login</Button>
                </FormGroup>
            </Form>
        );
    }
}