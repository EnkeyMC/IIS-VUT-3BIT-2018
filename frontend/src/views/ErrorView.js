import React from 'react';
import Logo from "../images/logo.png";
import { Container} from 'reactstrap';

export default class ProfileView extends React.Component {
    render () {
        return (
            <Container className="text-center">
                <div className="mt-5">
                    <span className="big-font">4</span>
                    <img src={Logo} alt="0" width="70px" height="93px" className="error-bug"/>
                    <span className="big-font">4</span>
                </div>
                <div>
                    Page not found
                </div>
            </Container>
        )
    }
}