import React from 'react';
import AuthLayout from './layouts/AuthLayout';
import {
    Col,
    Card,
    CardBody, FormGroup, Label, Button
} from 'reactstrap';
import {Link} from "react-router-dom";
import { Form, Input } from "../components/Form";
import {connect} from "react-redux";
import {setToken, setUser} from "../actions";
import {Redirect, withRouter} from "react-router";

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
    constructor(props) {
        super(props);

        this.handleFormSuccess = this.handleFormSuccess.bind(this);
    }

    handleFormSuccess(id, data) {
        this.props.setToken(data.token);
        this.props.setUser(data.user);

    }

    render () {
        if (this.props.user) {
            const state = this.props.location.state;
            if (state)
                return <Redirect to={state.from.pathname} />;
            else
                return <Redirect to="/"/>;
        }

        return (
            <Form id="login" url="/auth/login/" onSubmitSuccess={this.handleFormSuccess}>
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input name="username" id="username" />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input name="password" id="password" type="password" />
                </FormGroup>
                <FormGroup>
                    <Button type="submit" color="primary" className="w-100 mt-4">Login</Button>
                </FormGroup>
            </Form>
        );
    }
}

LoginForm = connect(
    state => {
        return {
            user: state.global.user
        };
    },
    dispatch => {
        return {
            setToken: token => dispatch(setToken(token)),
            setUser: user => dispatch(setUser(user))
        }
    }
)(withRouter(LoginForm));