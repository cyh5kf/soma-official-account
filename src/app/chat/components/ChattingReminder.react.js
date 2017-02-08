import React from 'react'
import classNames from 'classnames/bind';


export class ChattingReminder extends React.Component{
    render(){
        return (
                <div className="chatting-result-reminder-container">
                    <div className= {classNames({"chatting-result-reminder":true,
        "hide":!this.props.showReminder,"success":this.props.reminderType==="success","failed":this.props.reminderType==="failed"})}>
                        <span className="chatting-result-mark"></span>
                        <span className="chatting-result-word">{this.props.reminderWord}</span>
                    </div>
                </div>)
    }
}

export default ChattingReminder;