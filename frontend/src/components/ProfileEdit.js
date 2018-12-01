import React from 'react';
import CardContainer from "./CardContainer";
import {Button, CardBody, CardHeader, Col, Row} from "reactstrap";
import {Form} from "./form/Form";
import {StateRenderer} from "../utils";
import connect from "react-redux/es/connect/connect";
import {getLanguages} from "../actions/languages";
import {withAlert} from "react-alert";
import {Redirect, withRouter} from "react-router";
import {Link} from "react-router-dom";
import MultiSearchSelect, {MultiSelectItem} from "./form/MultiSearchSelect";
import {Input} from "./form/Input";
import {verifyUser} from "../actions/global";
import {getUser} from "../actions/users";

export default function ProfileEdit() {
    return (
        <CardContainer>
            <CardHeader className="h4">
                Edit profile
            </CardHeader>
            <CardBody>
                <ProfileEditForm />
            </CardBody>
        </CardContainer>
    );
}

class ProfileEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);

        this.state = {
            redirect: false
        };
    }


    componentDidMount() {
        this.props.getUser(this.props.loggedUser.username);
        this.props.getLanguages();
    }

    handleSubmitSuccess(id, data) {
        this.setState({redirect: true});
        if (data.username !== this.props.loggedUser.username)
            this.props.verifyUser();
        this.props.alert.success("Changes successfully saved.");
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.props.location.state ? this.props.location.state.from : '/profile'} />;

        return (
            <Form edit id="edit-profile" url={"/api/users/"+this.props.loggedUser.id+'/'} onSubmitSuccess={this.handleSubmitSuccess}>
                <p className="text-muted">Fields marked by <span className="text-danger">*</span> are required.</p>
                <StateRenderer state={this.props} renderCondition={this.props.user !== null && this.props.languages !== null}>
                    {props => {return (
                        <>
                            <Input label="Username" name="username" id="username" defaultValue={props.user.username} required />
                            <Input label="First name" name="first_name" id="first_name" defaultValue={props.user.first_name} />
                            <Input label="Last name" name="last_name" id="last_name" defaultValue={props.user.last_name} />
                            <Input type="email" label="E-mail" name="email" id="email" defaultValue={props.user.email} required />
                            <Input type="date" label="Birth date" name="birth_date" id="birth_date" defaultValue={props.user.birth_date} />
                            <MultiSearchSelect label="Programming languages" name="languages" id="languages" defaultValue={props.user.languages}>
                                {() => props.languages.map(item => <MultiSelectItem value={item.name} key={item.id} label={item.name} />)}
                            </MultiSearchSelect>
                            <Row form>
                                <Col md="4">
                                    <Button
                                        tag={Link}
                                        to={this.props.location.state ? this.props.location.state.from : '/profile'}
                                        color="secondary" className="w-100 mt-4"
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                                <Col md="8">
                                    <Button type="submit" color="primary" className="w-100 mt-4">Confirm</Button>
                                </Col>
                            </Row>
                        </>
                    );}}
                </StateRenderer>
            </Form>
        );
    }
}

ProfileEditForm = connect(
    (state) => {
        return {
            user: state.profileView.user,
            loggedUser: state.global.user,
            loading: state.profileView.loading || state.languages.loading,
            error: state.profileView.error ? state.profileView.error : state.languages.error,
            languages: state.languages.data
        }
    },
    dispatch => {
        return {
            getUser: username => dispatch(getUser(username)),
            getLanguages: () => dispatch(getLanguages()),
            verifyUser: () => dispatch(verifyUser())
        }
    }
)(withAlert(withRouter(ProfileEditForm)));
