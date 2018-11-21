import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logo from "../images/logo.png";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import {Link} from "react-router-dom";
import {logout} from "../actions";
import {withAlert} from "react-alert";

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };

        this.handleToggleNavbar = this.handleToggleNavbar.bind(this);
    }


    handleToggleNavbar() {
        this.setState({isOpen: !this.state.isOpen})
    }

    render () {
        return (
                <Navbar color="light" light expand="md" className="border-bottom position-fixed w-100 header-height">
                    <NavbarBrand tag={Link} to="/">
                        <img className="mr-2 align-middle" src={Logo} alt="" width="30px" height="40px" />
                        <span className="h2 align-middle">ZeroBugs</span>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.handleToggleNavbar} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <SearchCategory/>
                            </NavItem>
                            <NavItem>
                                <SearchBar />
                            </NavItem>
                            <NavItem>
                                {
                                    this.props.user ?
                                        <UserName user={this.props.user} />
                                        :
                                        <LogIn />
                                }
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
        )
    }
}

Header = connect(
    state => {
        return {
            user: state.global.user
        }
    }
)(Header);

class SearchCategory extends Component {
    constructor(props) {
        super(props);

        this.state = { term: '' };
    }
    render() {
        return (
            <UncontrolledDropdown setActiveFromChild>
                <DropdownToggle tag="a" className="nav-link pointer" caret>
                    Tickets
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem tag="a" href="/blah">Tickets</DropdownItem>
                    <DropdownItem tag="a" href="/blah">Bugs</DropdownItem>
                    <DropdownItem tag="a" href="/blah">Modules</DropdownItem>
                    <DropdownItem tag="a" href="/blah">Users</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

class SearchBar extends Component {
    // constructor(props) {
    //     super(props);
    //
    //     this.state = { term: '' };
    // }
    render() {
        return (
            <div className="search-bar">
                <input className="mr-5 mt-2" />
            </div>
        );
    }
}

function LogIn() {
    return (
        <NavLink tag={Link} to="/login" className="text-dark">Log In</NavLink>
    );
}

function UserName(props) {
    const logout = () => {
        props.logout()
            .then(action => {
                if (action.payload)
                    props.alert.success('You have been successfully logged out.');
                else
                    props.alert.error(action.error.message);
            });
    };
    return (
        <UncontrolledDropdown setActiveFromChild>
            <DropdownToggle tag="a" className="nav-link pointer" caret>
                {props.user.username}
            </DropdownToggle>
            <DropdownMenu className="shadow">
                <DropdownItem tag={Link} to="/profile">My profile</DropdownItem>
                <DropdownItem divider/>
                <DropdownItem tag="button" to="/" onClick={logout}>Log out</DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    );
}

UserName = connect(
    null,
    dispatch => {
        return {
            logout: () => dispatch(logout())
        }
    }
)(withAlert(UserName));
