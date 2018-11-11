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

import { toggleNavbar } from '../actions';
import {Link} from "react-router-dom";

export default class Header extends Component {
    render () {
        return (
                <Navbar color="light" light expand="md" className="border-bottom position-fixed w-100 header-height">
                    <NavbarBrand href="/">
                        <img className="mr-2 align-middle" src={Logo} width="30px" height="40px" />
                        <span className="h2 align-middle">ZeroBugs</span>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.props.onToggleNavbar} />
                    <Collapse isOpen={this.props.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink>Category</NavLink>
                            </NavItem>
                            <NavItem>
                                <SearchBar />
                            </NavItem>
                            <NavItem>
                                <UserName />
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
        )
    }
}

Header = connect(
    state => {
        return { isOpen: state.global.navbarIsOpen }
    },
    dispatch => {
        return { onToggleNavbar: () => dispatch(toggleNavbar()) }
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
                Zdenda Chovanec
            </DropdownToggle>
            <DropdownMenu right className="shadow">
                <DropdownItem tag="a" href="/blah">My profile</DropdownItem>
                <DropdownItem divider/>
                <DropdownItem tag="a" href="/blah">Log out</DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    );
}