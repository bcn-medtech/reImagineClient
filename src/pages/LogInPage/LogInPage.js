import React, { Component } from 'react';
//import Store from './../../../models/store';
import { isUserTokenInClient, saveUser } from '../../assets/Auth';
import Container from '@material-ui/core/Container';
import AppBar from '../../Components/AppBar/AppBar';
import { CssBaseline } from '@material-ui/core';


export class PlPageLogin extends Component {
    constructor(){
        super();
        this.state={
            extHTML: '',
        }
    }
    
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
        let url = "https://services.simbiosys.upf.edu/api-auth2/auth/google";

    }

    render() {

        return (
            <CssBaseline>
                <AppBar page="Deid App" history={this.props.history} />
                <div className="background">
                    <div id="loginContainer">
                        <webview id="foo" src="https://services.simbiosys.upf.edu/api-auth2/auth/google" style={styles.webContainer}></webview>
                    </div>
                </div>
            </CssBaseline>
        );
    }
}
const styles = {
    webContainer: {
    //    width: 600,
        height: 500,
    }
}