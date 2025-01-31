import React from 'react';
import {
    Col,
    Card,
    CardBody, Button, Row, Container
} from 'reactstrap';
import {Link} from "react-router-dom";
import { Form} from "../components/form/Form";
import {connect} from "react-redux";
import {setToken} from "../actions/global";
import {Redirect, withRouter} from "react-router";
import {withAlert} from "react-alert";
import DefaultLayout from "./layouts/DefaultLayout";
import {Input} from "../components/form/Input";
import {setUser} from "../actions/global";

export default class LoginView extends React.Component {
    render() {
        return (
            <DefaultLayout>
                <Container>
                    <Row className="justify-content-center align-self-center flex-fill">
                        <Col lg="5">
                            <Card className="p-4 mt-5">
                                <CardBody>
                                    <h1>Login</h1>
                                    <p className="text-muted">All fields are required</p>
                                    <LoginForm/>
                                    <p className="mt-4">Do not have an account, yet? <Link to="/register">Register here!</Link></p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </DefaultLayout>
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

        this.props.alert.success("You have been successfully logged in.");
    }

    componentDidMount() {
        const state = this.props.location.state;
        if (state && state.error) {
            this.props.alert.error(state.error);
        }
    }

    render () {
        if (this.props.user) {
            const state = this.props.location.state;
            if (state && state.from && state.from.pathname !== this.props.location.pathname)
                return <Redirect to={state.from.pathname+state.from.search} />;
            else
                return <Redirect to="/"/>;
        }

        return (
            <Form id="login" url="/auth/login/" onSubmitSuccess={this.handleFormSuccess}>
                <Input label="Username" name="username" id="username" />
                <Input label="Password" name="password" id="password" type="password" />
                <Button type="submit" color="primary" className="w-100 mt-4">Login</Button>
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
)(withRouter(withAlert(LoginForm)));