import React from 'react'
import $ from 'jquery'
import Auth from 'app/Auth'

export class Logout extends React.Component {
    componentDidMount() {
        this.closeAllConversation();
    }

    closeAllConversation() {
        $.ajax({
            url: '/api/v1/cs/conversation/closeallconv',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            data: {
            },
            success: (cont, txtStatus, xhr) => {
                Auth.logout();
                this.context.router.transitionTo('/')

                if (xhr.status === 200) {
                    console.log("close conversation ok: " + JSON.stringify(cont));
                }
                else {
                    console.log("close conversation error: " + JSON.stringify(cont));
                }
            },
            error: (xhr, txtStatus, errorThrown) => {
                console.log(xhr);
            }
        })
    }

    render() {
        return (<p></p>);
    }
}

Logout.contextTypes = {
    router: React.PropTypes.func.isRequired
};


export default Logout