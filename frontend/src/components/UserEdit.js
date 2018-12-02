import React from 'react';
import CardContainer from "./CardContainer";
import {Button, CardBody, CardHeader, Col, Row} from "reactstrap";
import {Redirect, withRouter} from "react-router";
import {Form, RequiredFieldsNotice} from "./form/Form";
import {StateRenderer} from "../utils";
import {Input} from "./form/Input";
import MultiSearchSelect, {MultiSelectItem} from "./form/MultiSearchSelect";
import {Link} from "react-router-dom";
import {getUser, getUserById, getUsersFiltered} from "../actions/users";
import {getLanguages} from "../actions/languages";
import {verifyUser} from "../actions/global";
import {withAlert} from "react-alert";
import {connect} from "react-redux";
import {Select} from "./form/Select";
import {Checkbox} from "./form/Checkbox";

export default function UserEdit() {
    return (
        <div className="info content-height">
            <CardContainer>
                <CardHeader className="h4">
                    Edit user
                </CardHeader>
                <CardBody>
                    <UserEditForm />
                </CardBody>
            </CardContainer>
        </div>
    );
}


class UserEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
    }


    componentDidMount() {
        this.props.getUserById(this.props.match.params.id);
        this.props.getLanguages();
    }

    handleSubmitSuccess(id, data) {
        this.props.alert.success("Changes successfully saved.");

        this.props.getUsersFiltered(this.props.match.params.position);
        this.props.history.push(this.getPathBack());
    }

    getPathBack() {
        return this.props.location.pathname.replace('/edit', '');
    }

    render() {
        return (
            <Form edit id="edit-user" url={"/api/users/"+this.props.match.params.id+'/'} onSubmitSuccess={this.handleSubmitSuccess}>
                <RequiredFieldsNotice/>
                <StateRenderer state={this.props} renderCondition={this.props.user !== null && this.props.languages !== null}>
                    {props => {return (
                        <>
                            <Select label="Role" name="position" id="position" defaultValue={props.user.position} required >
                                <option value="user">user</option>
                                <option value="programmer">programmer</option>
                                <option value="supervisor">supervisor</option>
                            </Select>
                            <Checkbox label="Is active" name="is_active" id="is_active" defaultValue={props.user.is_active}
                                hint="Uncheck this to disable account. (User won't be able to log in)"
                            />
                            <hr/>
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
                                        to={this.getPathBack()}
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

UserEditForm = connect(
    (state) => {
        return {
            user: state.profileView.user,
            loading: state.profileView.loading || state.languages.loading,
            error: state.profileView.error ? state.profileView.error : state.languages.error,
            languages: state.languages.data
        }
    },
    dispatch => {
        return {
            getUserById: id => dispatch(getUserById(id)),
            getLanguages: () => dispatch(getLanguages()),
            getUsersFiltered: filter => dispatch(getUsersFiltered(filter))
        }
    }
)(withAlert(withRouter(UserEditForm)));