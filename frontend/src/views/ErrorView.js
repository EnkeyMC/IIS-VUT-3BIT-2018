import React from 'react';
import Logo from "../images/logo.png";
import { Container, Row } from 'reactstrap';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class ErrorView extends React.Component {
    render () {
        let msg, digitFirst, digitLast;
        if (this.props.error === "404") {
            msg = "Page not found";
            digitFirst = "4";
            digitLast = "4";
        } else if (this.props.error === "403") {
            msg = "You don't have permission to view this page";
            digitFirst = "4";
            digitLast = "3";
        }

        return (
            <Container>
                <Row className="flex-mid">
                    <div className="mt-5">
                        <span className="big-font">{digitFirst}</span>
                        <img src={Logo} alt="0" width="70px" height="93px" className="error-bug"/>
                        <span className="big-font">{digitLast}</span>
                    </div>
                </Row>
                <Row className="flex-mid border-bottom">
                    <p className="font-size">
                        {msg}
                    </p>
                </Row>
                <Row className="flex-mid mt-5">
                    <ul className="fa-ul">
                        <GoTo name="Login" link="/login" icon="sign-in-alt"/>
                        <GoTo name="Tickets" link="/tickets" icon="receipt"/>
                        <GoTo name="Bugs" link="/bugs" icon="bug"/>
                        <GoTo name="Modules" link="/modules" icon="clone"/>
                        <GoTo name="Patches" link="/patches" icon="band-aid"/>
                    </ul>
                </Row>
            </Container>
        )
    }
}

function GoTo(props) {
    return (
        <li className="mt-2">
            <span className="fa-li"><FontAwesomeIcon icon={props.icon}/></span>
            Go to: <Link to={props.link}>{props.name}</Link>
        </li>
    );
}