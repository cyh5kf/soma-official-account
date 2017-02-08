import React from 'react';
import {Redirect, Route, DefaultRoute, NotFoundRoute} from 'react-router';

import App from 'app/App'
import Home from 'app/home/Home'
import Chat from 'app/chat/ChatApp.react'
import History from 'app/history/History'
import Broadcast from "app/broadcast/Broadcast.react"
import Artical from "app/artical/Artical.react"
import ArticalEditor from "app/artical/ArticalEditor.react"
import Setting from 'app/setting/Setting'
import Help from 'app/help/Help'
import Login from 'app/login/Login'
import Logout from 'app/logout/Logout'
import NotFound from 'app/NotFound'

import PersonalInfomation from 'app/setting/personalInfomation/PersonalInfomation'

import QuickReply from 'app/setting/quickReply/QuickReply'
import SystemAutoReply from 'app/setting/systemAutoReply/SystemAutoReply'
import TeamAndGroup from 'app/setting/teamAndGroup/TeamAndGroup'
import MessageDistribution from 'app/setting/messageDistribution/MessageDistribution'
import UserTag from 'app/setting/userTag/UserTag'
import ConversationRules from 'app/setting/conversationRules/ConversationRules'

import SetEditorTeam from 'app/setting/setEditorTeam/SetEditorTeam'
import SubscriptionMessage from 'app/setting/subscriptionMessage/SubscriptionMessage'
import SelfDefinedMenu from 'app/setting/selfDefinedMenu/SelfDefinedMenu'
import UserManagement from 'app/setting/userManagement/UserManagement'
import AccountInformation from 'app/setting/accountInformation/AccountInformation'


const routes = (
    <Route handler={App}>
        //多客服首页
        <DefaultRoute name="home" handler={Home}/>
        //多客服对话
        <Route name="chat" path="chat" handler={Chat}/>
        //多客服历史
        <Route name="history" path="history" handler={History}/>
        <Route name="broadcast" path="broadcast" handler={Broadcast}/>
        <Route name="artical" path="artical" handler={Artical}/>
        <Route name="articalEditor" path="articalEditor" handler={ArticalEditor}/>
        
        //多客服设置
        <Route name="setting" path="setting" handler={Setting}>
            <DefaultRoute name="personalInfomation" path="personalInfomation" handler={PersonalInfomation}/>

            <Route name="quickReply" path="quickReply" handler={QuickReply}/>
            <Route name="systemAutoReply" path="systemAutoReply" handler={SystemAutoReply}/>
            <Route name="teamAndGroup" path="teamAndGroup" handler={TeamAndGroup}/>
            <Route name="messageDistribution" path="messageDistribution" handler={MessageDistribution}/>
            <Route name="userTag" path="userTag" handler={UserTag}/>
            <Route name="conversationRules" path="conversationRules" handler={ConversationRules}/>

            <Route name="setEditorTeam" path="setEditorTeam" handler={SetEditorTeam}/>
            <Route name="subscriptionMessage" path="subscriptionMessage" handler={SubscriptionMessage}/>
            <Route name="selfDefinedMenu" path="selfDefinedMenu" handler={SelfDefinedMenu}/>
            <Route name="userManagement" path="userManagement" handler={UserManagement}/>
            <Route name="accountInformation" path="accountInformation" handler={AccountInformation}/>
        </Route>
        <Route name="help" path="help" handler={Help}/>
        //多客服登录
        <Route name="login" path="login" handler={Login}/>
        <Route name="logout" path="logout" handler={Logout}/>
        //非法路径
        <NotFoundRoute handler={NotFound}/>
    </Route>
);

export default routes;