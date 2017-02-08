import React from "react";
import {requireAuth} from "app/Session";
import ChatListSideBar from "app/chat/components/ChatListSideBar.react";
import ChatHolder from "app/chat/components/chatholder.react";
import RouteComponent from "app/RouteComponent";
import Auth from "app/Auth";
import QueueUpTips from "app/chat/components/QueueUpTips.react"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import log from "loglevel"
import SystemMessageStore from "app/chat/stores/SystemMessageStore";





export class ChatApp extends RouteComponent{
    constructor(props) {
        super(props);
        this.state = {
            "waitingCount":0
        }
    };

    

    componentDidMount(){
        SystemMessageStore.addChangeListener(this.killOunt.bind(this));
        let that = this;
        var successHandler = function (waitingCount) {
            if(that.state.waitingCount != waitingCount){
                that.state.waitingCount = waitingCount;
                that.setState(that.state)
            }

        }
        ChatWebAPIUtils.getWaiting(successHandler);
        this.intervalId = setInterval(function () {
            ChatWebAPIUtils.getWaiting(successHandler);
        },5000);
    }

    componentWillUnmount(){
        if(this.intervalId){
            clearInterval(this.intervalId);
        }
        SystemMessageStore.removeChangeListener(this.killOunt.bind(this));
    }
    killOunt(){
        if(this.intervalId){
            clearInterval(this.intervalId);
        }
    }

    componentWillMount(){
        
        //其他页面的初始化都从这里来添加
        require.ensure([], function() {
            require('static/css/common.css');
            require('static/css/reset.css');
            require('static/css/chat.css');
        }.bind(this));
    }


    render(){
        return (
            <div id="chatting-main">
                <QueueUpTips waitingCount={this.state.waitingCount}/>
                <ChatListSideBar />
                <ChatHolder />
            </div>
        );
    }
}

ChatApp.contextTypes = {
    router: React.PropTypes.func.isRequired
};


export default ChatApp;
