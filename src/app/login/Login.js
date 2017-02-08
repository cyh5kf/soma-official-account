import React from 'react'
import $ from 'jquery'
import Auth from 'app/Auth'
import Session from 'app/Session'
import Lang from "lang/Lang"
import Const from "app/Const"


class Info extends React.Component {
    render(){
        if (this.props.code === 0) {
            return (
                <div className="login-mes">
                </div>
            );
        }
        else if (this.props.code === 18) {
            return (
                <div className="login-mes">
                    <p className="error">{Lang.str("app_login_Error_InvalidId")}</p>
                </div>
            );
        }
        else if (this.props.code === 23) {
            return (
                <div className="login-mes">
                    <p className="error">{Lang.str("app_login_Error_InvalidId")}</p>
                    <p className="info">{Lang.str("app_login_Error_Warning")}</p>
                </div>
            );
        }
        else if (this.props.code === 19) {
            return (
                <div className="login-mes">
                    <p className="error">{Lang.str("app_login_Error_AccountBlock")}</p>
                </div>
            );
        }
        else {
            return (
                <div className="login-mes">
                    <p className="error">Code={this.props.code}, Message={this.props.message}.
                    </p>
                </div>
            );
        }
    }
}

export class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = { code: 0, message: '', logging: false }
    }

    static willTransitionTo(transition){
        if(Auth.loggedIn()){
            transition.redirect('/', {}, {});
        }
    }

    componentDidMount() {
        require.ensure([], function() {
            require('static/css/reset.css');
            require('static/css/login.css');
        }.bind(this));
    }

    setOnlineStatus(status) {
        Session.setStatus("online");
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/agent/setstatus?status=" + status,
            async: true,
            success: (cont, txtStatus, xhr) => {
                if (xhr.status === 200) {
                    console.log("set status ok: " + JSON.stringify(cont));
                }
                else {
                    console.log("set status error: " + JSON.stringify(cont));
                }
            },
            error: (xhr, txtStatus, errorThrown) => {
                console.log(xhr);
            }
        });
    }

    handleSubmit(event) {
        if (this.state.logging === true) {
            console.log('logging');
            return;
        }

        const email = React.findDOMNode(this.refs.email).value;
        const passwd = React.findDOMNode(this.refs.passwd).value;
        this.setState({ code: 0, message: "", logging: true });
        Auth.login(email, passwd, (res) => {
            if (!res.authenticated) {
                console.log(res);
                return this.setState({ code: res.data.code, message: res.data.message, logging: false });
            }

            if (Session.getRole() != Const.ROLE.SUPER) {
                this.setOnlineStatus("online");
            }

            this.context.router.transitionTo('/');
        })
    }

    handleInputKeyPress(event) {
        this.state.code = 0;
        this.state.message = "";
        this.forceUpdate();
        if(event.keyCode === 13) {
            this.handleSubmit(event);
        }
    }

    handleTest(event) {
        console.log($);
        console.log($('.login-bg'));
        $('.login-bg').hide();
    }

    render(){
        var cssId = "signin-enable";
        if (this.state.logging) {
            cssId = "signin-disable";
        }

        return (
            <div className="login-bg">
                <div id="login">
                    <div className="logo"></div>
                    <h3>{Lang.str("app_login_Title")}</h3>

                    <input ref="email" type="text" placeholder="someone@instanza.org" defaultValue={Session.getEmail()}
                           onKeyDown={this.handleInputKeyPress.bind(this)}
                    />
                    <input ref="passwd" type="password" placeholder="password"
                           onKeyDown={this.handleInputKeyPress.bind(this)}
                    />
                    <a id={cssId} onClick={this.handleSubmit.bind(this)}>{Lang.str("app_login_SignIn")}</a>
                    <Info code={this.state.code} message={this.state.message} />
                </div>
                <p className="copyright">© 2016 Instanza</p>
            </div>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Login;
