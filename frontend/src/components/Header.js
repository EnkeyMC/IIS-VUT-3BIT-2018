import React, { Component } from 'react';
import SearchBar from './SearchBar';
import Logo from "../images/logo.jpg";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink, } from 'reactstrap';

class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render () {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">
                        <img className="mr-2" src={Logo} alt="Logo"/>
                        ZeroBugs
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
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

export default Header;