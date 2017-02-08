import React from 'react'
import RouteComponent from 'app/RouteComponent'
import Lang from "lang/Lang"

export class Help extends RouteComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render(){
        return (
            <div id="main">
                <p>Help</p>
            </div>
        )
    }
}

export default Help;