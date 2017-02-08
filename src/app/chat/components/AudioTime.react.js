import React from 'react'

export class AudioTime extends React.Component{
    constructor(props) {
        super(props);
    };
    componentDidMount(){
    }

    componentWillUnmount(){
    }


    render(){
        return (
            <span  className="sound-time" >{this.props.duration}"</span>
         )
    }
}
export default AudioTime;