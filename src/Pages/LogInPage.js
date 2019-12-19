import React, { Component } from 'react';
//import Store from './../../../models/store';
import { isUserTokenInClient, saveUser } from '../assets/Auth';
import AppBar from '../Components/AppBar'

export class PlPageLogin extends Component {

    componentDidMount() {

        if (isUserTokenInClient()) {
            this.setUrl("patients");
        } else {
            if (window.location.href.indexOf("token") !== -1) {
                const urlParams = new URLSearchParams(window.location.search);
                const family_names = urlParams.get('family_names');
                const token = urlParams.get('token');
                const name = urlParams.get('name');
                const email = urlParams.get('email');
                saveUser(token, name, family_names, email);
                this.setUrl("patients");
            }
        }

    }

    setUrl(url) {

        if (url !== false) {

            var browserHistory = this.props.history;
            browserHistory.push("/" + url);

        } else {
            alert("URL not compatible");
        }

    }

    onClickLoginButton() {
        window.location = "https://services.simbiosys.upf.edu/api-auth2/auth/google";
    }

    render() {

        return (
            <div className="background">
                <AppBar page="Deid App" history={this.props.history} />
                <div>
                    <div className="button" onClick={this.onClickLoginButton.bind(this)}>
                        <div>
                            <svg className="play-button-svg" width="32" height="32" viewBox="0 0 32 32">
                                <path d="M7 28a1 1 0 0 1-1-1V5a1 1 0 0 1 .5-.87 1 1 0 0 1 1 0l19 11a1 1 0 0 1 0 1.74l-19 11A1 1 0 0 1 7 28zM8 6.73v18.54L24 16z"></path>
                            </svg>
                        </div>
                        <div> Login with&nbsp;<b>Google</b></div>
                    </div>
                </div>
            </div>
        );
    }
}