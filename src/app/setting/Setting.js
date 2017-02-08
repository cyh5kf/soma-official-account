import React from 'react'
import RouteComponent from 'app/RouteComponent'
import $ from "jquery"
import {Link} from 'react-router'
import {RouteHandler} from 'react-router'
import {Session} from 'app/Session'
import Lang from 'lang/Lang';

export class SettingSideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    expandMenu(menuName){
        if($('h3 span[value=' + menuName + ']').hasClass('isShow')) {
            $('h3 span[value=' + menuName + ']').removeClass('isShow').addClass("isHidden");
        }
        else {
            $('h3 span[value=' + menuName + ']').removeClass('isHidden').addClass("isShow");
        }

        $('li.' + menuName) .slideToggle();
    }

    render() {
        var that = this;
        var myrole = Session.getRole();
        console.log("user role:" + myrole);

        var commSettings = [
            {role: "0129", name: "personalInfomation", text:Lang.str('app_setting_SideBar_MyProfile') , style:"icon-p-info"}
        ];

        var csSettings = [
            {role: "019", name: "quickReply", text: Lang.str('app_setting_SideBar_QuickReply'), style:"icon-q-reply"},
            {role: "19", name: "teamAndGroup", text: Lang.str('app_setting_SideBar_TeamAndGroup'), style:"icon-t-group"},
            {role: "19", name: "messageDistribution", text: Lang.str('app_setting_SideBar_MessageDistribution'), style:"icon-m-dis"},
            {role: "19", name: "systemAutoReply", text: Lang.str('app_setting_SideBar_SystemAutoReply'), style:"icon-s-reply"},
            {role: "19", name: "userTag", text: Lang.str('app_setting_SideBar_UserTag'), style:"icon-u-tag"},
//            {role: "19", name: "conversationRules", text: Lang.str('app_setting_SideBar_ConversationRules'), style:"icon-c-rules"}
        ];

        var publicSettings = [
            {role: "9", name: "setEditorTeam", text: Lang.str('app_setting_SideBar_SetEditorTeam'), style:"icon-q-reply"},
            {role: "9", name: "subscriptionMessage", text: Lang.str('app_setting_SideBar_SubscriptionMessage'), style:"icon-t-group"},
//            {role: "29", name: "selfDefinedMenu", text: Lang.str('app_setting_SideBar_SelfDefinedMenu'), style:"icon-m-dis"},
//            {role: "29", name: "userManagement", text: Lang.str('app_setting_SideBar_UserManagement'), style:"icon-s-reply"},
            {role: "9", name: "accountInformation", text: Lang.str('app_setting_SideBar_AccountInformation'), style:"icon-u-tag"}
        ];

        var commSettingItems = [];
        if ("0129".indexOf(myrole) >= 0) {
            commSettingItems.push(
                <h3 className="hasIcon commSettingsHead" onClick={that.expandMenu.bind(that, "commSet")}>
                    <span className="title">{Lang.str('app_setting_SideBar_PersonalInformation')}</span>
                    <span className="isShow" id="expand" value="commSet"></span>
                </h3>
            );
        }
        commSettings.forEach(function (settingTag,index) {
            if(settingTag.role.indexOf(myrole) >= 0) {
                var className = "setting-icons "+settingTag.style;
                commSettingItems.push(
                    <li className={index==commSettings.length-1?"hasBorder commSet":"commSet"}>
                        
                        <Link to={settingTag.name}>
                            <span className="tagFocus" id={settingTag.name}></span>
                            <i className = {className}></i>
                            <span className ="specCon">{settingTag.text}</span>
                        </Link>
                    </li>
                );
            }
        });

        var csSettingItems = [];
        if ("019".indexOf(myrole) >= 0) {
            csSettingItems.push(
                <h3 className="hasIcon csSettingHead" onClick={that.expandMenu.bind(that, "csSet")}>
                    <span className="title">{Lang.str('app_setting_SideBar_ServiceCloud')}</span>
                    <span className="isShow" id="expand" value="csSet"></span>
               
                </h3>
            );
        }
        csSettings.forEach(function (settingTag,index) {
            if(settingTag.role.indexOf(myrole) >= 0) {
                var className = "setting-icons "+settingTag.style;
                csSettingItems.push(
                    <li className={index==csSettings.length-1?"hasBorder csSet":"csSet"}>
                        <Link to={settingTag.name}>
                            <span className="tagFocus" id={settingTag.name}></span>
                            <i className = {className}></i>
                            <span>{settingTag.text}</span>
                        </Link>
                    </li>
                );
            }
        });

        var publicSettingItems = [];
        if ("9".indexOf(myrole) >= 0) {
            publicSettingItems.push(
                <h3 className="hasIcon publicSettingHead" onClick={that.expandMenu.bind(that, "publicSet")} >
                    <span className="title">{Lang.str('app_setting_SideBar_MediaCloud')}</span>
                    <span className="isShow" id="expand" value="publicSet"></span>
                </h3>
            );
        }
        publicSettings.forEach(function (settingTag,index) {
            if(settingTag.role.indexOf(myrole) >= 0) {
                var className = "setting-icons "+settingTag.style;
                publicSettingItems.push(
                    <li className={index==publicSettings.length-1?"hasBorder publicSet":"publicSet"}>
                        <Link to={settingTag.name}>
                            <span className="tagFocus" id={settingTag.name}></span>
                            <i className = {className}></i>
                            <span>{settingTag.text}</span>
                        </Link>
                    </li>
                );
            }
        });

        return (
            <nav id="setting">               
                <ul className="menu">
                    {commSettingItems}
                    {csSettingItems}
                    {publicSettingItems}
                </ul>
            </nav>
        );
    }
}

export class Setting extends RouteComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        require.ensure([], function () {
            require('static/css/reset.css');
            require('static/css/common.css');
            require('static/css/setting.css');
        }.bind(this));
    }

    render() {
        return (
                    <div id="setting_main">
                        <SettingSideBar />
                        <RouteHandler forceUpdate={this.props.forceUpdate}/>
                    </div>
        )
    };
}

export default Setting;
