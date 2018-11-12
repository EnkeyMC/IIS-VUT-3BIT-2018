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
                    <NavbarBrand href="/">
                        <img className="mr-2 align-middle" src={Logo} alt="" width="30px" height="40px" />
                        <span className="h2 align-middle">ZeroBugs</span>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.handleToggleNavbar} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink>Category</NavLink>
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

function LogIn(props) {
    return (
        <NavLink tag={Link} to="/login" className="text-dark">Log In</NavLink>
    );
}

function UserName(props) {
    return (
        <UncontrolledDropdown setActiveFromChild>
            <DropdownToggle tag="a" className="nav-link user-name" caret>
                {props.user.username}
            </DropdownToggle>
            <DropdownMenu right className="shadow">
                <DropdownItem tag={Link} to="/profile">My profile</DropdownItem>
                <DropdownItem divider/>
                <DropdownItem tag={Link} to="/" onClick={props.logout}>Log out</DropdownItem>
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
)(UserName);
