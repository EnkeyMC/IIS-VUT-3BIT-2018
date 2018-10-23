import React, { Component } from 'react';
import SearchBar from './SearchBar';
import { connect } from 'react-redux';
import Logo from "../images/logo.png";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink, } from 'reactstrap';

import { toggleNavbar } from '../actions';

export default class Header extends Component {
    render () {
        return (
            <div className="border-bottom">
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">
                        <img className="mr-2 logo align-middle" src={Logo} alt="Logo"/>
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
                                <NavLink className="text-dark">Log In</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}

Header = connect(
    state => {
        return { isOpen: state.navbarIsOpen }
    },
    dispatch => {
        return { onToggleNavbar: () => dispatch(toggleNavbar()) }
    }
)(Header);