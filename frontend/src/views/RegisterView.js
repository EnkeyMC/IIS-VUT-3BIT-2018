import React from 'react';
import {
    Col,
    Card,
    CardBody,
    Button, Container, Row
} from 'reactstrap';
import {Link} from "react-router-dom";
import {Form, Input} from "../components/Form";
import {copyMerge} from "../utils";
import {Redirect, withRouter} from "react-router";
import connect from "react-redux/es/connect/connect";
import {setToken, setUser} from "../actions";
import {withAlert} from "react-alert";
import DefaultLayout from "./layouts/DefaultLayout";

export default class RegisterView extends React.Component {
    render() {
        return (
            <DefaultLayout>
                <Container>
                    <Row className="justify-content-center align-self-center flex-fill">
                        <Col md="7">
                            <Card className="p-4 mt-5">
                                <CardBody>
                                    <h1>Register</h1>
                                    <p className="text-muted">Create new account. All fields are required.</p>
                                    <RegisterForm />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </DefaultLayout>
        );
    }
}

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleBeforeSubmit = this.handleBeforeSubmit.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);

        this.state = {
            redirect: false
        }
    }

    handleSuccess(id, data) {
        this.props.setToken(data.token);
        this.props.setUser(data.user);

        this.props.alert.success("You have been successfully registered.");
        this.setState({redirect: true});
    }

    handleBeforeSubmit(state, event, setFormState) {
        if (state.fields.password.value !== state.fields.passwordVerify.value) {
            setFormState(copyMerge(state, {
                fields: copyMerge(state.fields, {
                    passwordVerify: copyMerge(state.fields.passwordVerify, {
                        error: "Passwords do not match"
                    })
                })
            }));
            return false;
        } else {
            setFormState(copyMerge(state, {
                fields: copyMerge(state.fields, {
                    passwordVerify: copyMerge(state.fields.passwordVerify, {
                        error: null
                    })
                })
            }));
            return true;
        }
    }

    render() {
        if (this.state.redirect)
            return <Redirect to="/profile" />;

        return (
            <Form id="register" url="/auth/register/" beforeSubmit={this.handleBeforeSubmit} onSubmitSuccess={this.handleSuccess}>
                <Input label={{text: "Username"}} name="username" id="username" />
                <Input label={{text: "Email"}} type="email" name="email" id="email" />
                <Input label={{text: "Password"}} name="password" id="password" type="password" />
                <Input label={{text: "Verify password"}} hint="Verify password by entering the same password from the above field." name="passwordVerify" id="password-verify" type="password" />
                <Button className="mt-3 w-100" color="primary">Register</Button>
                <p className="mt-4">Already have an account? <Link to="/login">Login here!</Link></p>
            </Form>
        );
    }
}

RegisterForm = connect(
    null,
    dispatch => {
        return {
            setToken: token => dispatch(setToken(token)),
            setUser: user => dispatch(setUser(user))
        }
    }
)(withRouter(withAlert(RegisterForm)));