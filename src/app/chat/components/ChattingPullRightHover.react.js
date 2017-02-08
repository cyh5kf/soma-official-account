import React from 'react'



export class ChattingPullRightHover extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render(){
        let typeClassName = "chatting-pull-right-Hover " +  this.props.type;
        if (this.props.type == "quickreply")
        {
            return (<div className={typeClassName} style={{"top": this.props.posy+"px"}}>
                 {this.props.text}
            </div>);
        }
        return (<div className={typeClassName}>
                    <span className="chatting-pull-right-text">
                        {this.props.text}
                    </span>
                </div>);
    }
}

export default ChattingPullRightHover;