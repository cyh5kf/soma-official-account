/**
 * 登录之后的入口
 */
import React from 'react'
import {Link} from 'react-router'
import {RouteHandler} from 'react-router';
import Auth from "app/Auth"
import $ from "jquery"
import Session from "app/Session"
import Lang from "lang/Lang"
import Const from "app/Const"
import {ImageThumbHelper} from 'utils/ImageThumbHelper'
import UnreadConversationStore from "app/chat/stores/UnreadConversationStore"
import WebsocketUtils from "app/chat/utils/WebsocketUtils"
import ConversationStore from "app/chat/stores/ConversationStore"
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import SystemMessageStore from "app/chat/stores/SystemMessageStore";
import {HelpDialog} from 'app/help/HelpDialog'



export class SideBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            unreadNum:UnreadConversationStore.getAllUnreadNum()
        }
    }

    componentDidMount(){
        this.state.status = Session.getStatus();  
        this.setState(this.state);      //editor登录时，由于这个state在render时还没有取，导致不显示自己的在线状态，所以这里获取后直接做下刷新
        UnreadConversationStore.addChangeListener(this._onChange.bind(this));
        ConversationStore.addChangeListener(this.onTransition.bind(this));
        var role = Session.getRole();
        if (role == Const.ROLE.NORMAL || role == Const.ROLE.ADMIN || role == Const.ROLE.SUPER) {
            WebsocketUtils.initWebSocket();
            let url = '/api/v1/cs/conversation/getconvlist';
            if ( role == Const.ROLE.ADMIN || role == Const.ROLE.SUPER) {
                url = '/api/v1/cs/conversation/getallconvlist';
            }
            var getConvListSuccessHandler = function(rawMessages){
                ChatServerActionCreator.receiveConversations(rawMessages);
            }
            ChatWebAPIUtils.getAllConversations(getConvListSuccessHandler,url)
        }

    }

    
    componentWillUnmount(){
        UnreadConversationStore.removeChangeListener(this._onChange.bind(this));
        ConversationStore.removeChangeListener(this.onTransition.bind(this));
        SystemMessageStore.removeChangeListener(this._onChange.bind(this));
    }

    _onChange(){        
        this.setState({
            unreadNum:UnreadConversationStore.getAllUnreadNum()
        });
    }

    onTransition(){
        if(ConversationStore.getTransition()){
            this.context.router.transitionTo('/chat');
            ConversationStore.setTransition(false)
        }
    }

    setOnlineStatus(status, successhandler, errorhandler) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/agent/setstatus?status=" + status,
            async: true,
            success: successhandler,
            error: errorhandler
        });
    }

    onStatusClick(e) {
        if($('#aside_status').is(":hidden")){
            $('#aside_status').fadeIn(10,"swing");
        }
        else{
            $('#aside_status').fadeOut(10,"swing");
        }
        
    }

    onStatusSelect(status) {
        if (status == "logout") {
            Auth.logout(() => {
                console.log(this.context);
                this.context.router.transitionTo('/');
//                var rurl = location.protocol + '//' + location.host
//                window.location.href = rurl;
            });
            return;
        }

        if (status != "online") status = "offline";
        let that = this;
        console.log("---------status:" + status);
        that.setOnlineStatus(status, function(data){
            $('#aside_status').hide();
            Session.setStatus(status);  // update localstorage
            that.state.status = status;
            that.setState(that.state);
        }, function(data) {
            console.log("error---------");
        });
    }
    onHideAsideClick(e){
        if($(e.target).hasClass("asideTrigger") || $(e.target).attr("id")=="status_point"
        || $(e.target).hasClass("avatar")){
            return;
        }
        $('#aside_status').hide();
    }
    onMouseOutAsideHide(e){
        $('#aside_status').hide();
    }
    
    showHelpDlg(){   
        var urlHelpDoc = "https://d51wm8y7a2ot9.cloudfront.net/official-account/doc/SOMA-Public-Account-Guide-"+Lang.str("app_lang")+"-v4.pdf";
        window.open(urlHelpDoc);                              
    }
    
    handleDialog (evtype) {
                    if('x' === evtype) {
                        $("div[id*='tag_dialog_bg']").css("opacity",1);
                        this.state.showDlDialog = false;
                    } else if('a' === evtype) {
                        this.state.showDlDialog = true;
                    }
                    this.setState(this.state);
                }


    render(){
        var dlDialog = "";
        var onlineLabel = "online";
        var offlineLabel = "offline";
        if (this.state.status == "online") {
            onlineLabel = onlineLabel + " active";
        } else if (this.state.status == "offline") {
            offlineLabel = offlineLabel + " active";
        }

        var role = Session.getRole();
        var asideMenuItems = [];

        if (role == Const.ROLE.NORMAL || role == Const.ROLE.ADMIN || role == Const.ROLE.EDITOR || role == Const.ROLE.SUPER) {
            asideMenuItems.push(
                <Link to='home'>
                    <i className="icon-home"></i>
                    <span>{Lang.str("app_SideBar_Menu_Home")}</span>
                </Link>
            );
        }



        if (role == Const.ROLE.NORMAL || role == Const.ROLE.ADMIN || role == Const.ROLE.SUPER) {
            let unreadHtml = null;
            if(this.state.unreadNum > 0){
                let styles = null;
                if(this.state.unreadNum>9){
                    styles = {padding:"0 3px"};
                }
                unreadHtml = <div className="sidebar-msg-unread-num" style={styles}>{this.state.unreadNum}</div>
            }
            asideMenuItems.push(
                <Link to='chat'>
                    {unreadHtml}
                    <i className="icon-message"></i>
                    <span>{Lang.str("app_SideBar_Menu_Chat")}</span>
                </Link>
            );
        }

        if (role == Const.ROLE.NORMAL || role == Const.ROLE.ADMIN || role == Const.ROLE.SUPER) {
            asideMenuItems.push(
                <Link to='history'>
                    <i className="icon-history"></i>
                    <span>{Lang.str("app_SideBar_Menu_History")}</span>
                </Link>
            );
        }

        if (role == Const.ROLE.EDITOR || role == Const.ROLE.SUPER) {
            asideMenuItems.push(
                <Link to='broadcast'>
                    <i className="icon-broadcast"></i>
                    <span>{Lang.str("app_SideBar_Menu_Broadcast")}</span>
                </Link>
            );
        }

        if (role == Const.ROLE.EDITOR || role == Const.ROLE.SUPER) {
            asideMenuItems.push(
                <Link to='artical'>
                    <i className="icon-article"></i>
                    <span>{Lang.str("app_SideBar_Menu_Article")}</span>
                </Link>
            );
        }

        var avatar = Session.getAvatar();
        if (avatar == null || avatar == "") {
            avatar = require("static/images/settings/default-avatar1.jpg");
        }
        else {
            avatar=ImageThumbHelper.getSquareThumbUrlByDefaultSize(avatar);
        }
        
         if (this.state.showDlDialog) {
            dlDialog = <HelpDialog                       
            dialogHandler={this.handleDialog.bind(this)} />;
        }
                          
        return (
            <header id="aside" onMouseLeave={this.onMouseOutAsideHide.bind(this)} onClick={this.onHideAsideClick.bind(this)}>
                <div className="avatar" onClick={this.onStatusClick.bind(this)} >
                    <img className="asideTrigger" id={this.state.status}  src={avatar}/>
                        <i className={this.state.status}  id="status_point"></i>
                        <div id="aside_status">
                            <div>
                                <a className={onlineLabel} href="#" onClick={this.onStatusSelect.bind(this, "online")}>
                                    <i></i>{Lang.str("app_SideBar_Avatar_Online")}
                                </a>
                                <a className={offlineLabel} href="#" onClick={this.onStatusSelect.bind(this, "offline")}>
                                    <i></i>{Lang.str("app_SideBar_Avatar_Offline")}
                                </a>
                                {/*
                                <a className="logout" href="#" onClick={this.onStatusSelect.bind(this, "logout")}>Logout</a>
                                */}
                                <Link className="logout" to='logout'>{Lang.str("app_SideBar_Avatar_Logout")}</Link>
                            </div>
                            <label></label>
                        </div>
                </div>

                <div id="aside_menu" className="aside-menu">
                    {asideMenuItems}
                </div>

                <div id="aside_footer" className="aside-menu">
                    <Link to='setting'>
                        <i className="icon-setting"></i>
                        <span>{Lang.str("app_SideBar_Menu_Setting")}</span>
                    </Link>
                    <a className="footer_btn_help" onClick={this.showHelpDlg.bind(this)}>
                        <i className="icon-help"></i>
                        <span>{Lang.str("app_SideBar_Menu_Help")}</span>
                    </a>
                    
                </div>
            </header>
        );
    }
}

SideBar.contextTypes = {
    router: React.PropTypes.func.isRequired
};

function getStateFromStores() {
    return {
        showKickOutDialog:SystemMessageStore.shouldKillOut()
    };
}

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = getStateFromStores();
    }

    _onChange(){        
        this.setState(getStateFromStores());
    }

    relogin() {
        Auth.logoutWithoutLogoutRequest();
        var rurl = location.protocol + '//' + location.host
        window.location.href = rurl;
    }

    componentDidMount() {
        require.ensure([], function() {
            require('static/css/reset.css');
            require('static/css/common.css');
        }.bind(this));
        SystemMessageStore.addChangeListener(this._onChange.bind(this));
    }

    componentWillUnmount(){
        SystemMessageStore.removeChangeListener(this._onChange.bind(this));
    }

    onForceUpdate(e) {
        this.forceUpdate();
    }

    render(){
        let killOutBackDropDialog = null;
        let killOutDialog = null;

        if(this.state.showKickOutDialog){
            killOutBackDropDialog = <div className="modal-backdrop fade in"></div>
            killOutDialog = <div className="kick-out-modal">
                <div className="kick-out-notice-header">
                    <h1 className="kick-out-notice-header-notice">Notice</h1>
                </div>
                <div className="kick-out-alert">
                    <div className="kick-out-alert-icon">
                        <span>!</span>
                    </div>
                </div>

                <div className="kick-out-text">
                    <p>Your account has been logged in on another place. If it is not your operation, please check with administrator and change password if necessary.</p>
                </div>
                <div className="kick-out-btn">
                    <div className="kick-out-ok-btn" onClick={this.relogin.bind(this)}>OK</div>
                </div>
            </div>
        }

        if (Auth.loggedIn()) {
            return (
                <div id="wrapper">
                    <SideBar />
                    {killOutBackDropDialog}
                    {killOutDialog}
                    <RouteHandler forceUpdate={this.onForceUpdate.bind(this)}/>
                </div>
            )
        }
        else {
            return (
                <RouteHandler />
            )
        }
    };
}

App.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default App;
