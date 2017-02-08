import React from 'react'

export class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render(){
        return <p>404 NOT FOUND</p>;
    }
}

export default NotFound;