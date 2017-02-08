import React from 'react'
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import classNames from 'classnames/bind';
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import ConversationStore from "app/chat/stores/ConversationStore"
import MessageStore from "app/chat/stores/MessageStore"
import $ from "jquery"

import Lang from "lang/Lang"
import {byteLength,cutString} from "utils/tools"




var colorMap = {
    "1":"tag-orange",
    "2":"tag-green",
    "3":"tag-blue",
    "4":"tag-pink",
    "5":"tag-red",
    "6":"tag-purple",
    "7":"tag-brown",
    "8":"tag-gray"
}


export class RightInfoPanel extends React.Component{
    constructor(props) {
        super(props);
        let remarkObj = {};
        remarkObj[props.conversation.uid] = props.conversation.somaUser.remark;
        let tagColorObj = {};
        let tagNameObj = {};
        if(props.conversation.somaUser.tag){
            tagColorObj[props.conversation.uid] = colorMap[props.conversation.somaUser.tag.color];
            tagNameObj[props.conversation.uid] = props.conversation.somaUser.tag.name;
        }
        else{
            tagColorObj[props.conversation.uid] = "";
            tagNameObj[props.conversation.uid] = "";
        }

        let duration = Math.ceil((new Date().getTime() - props.conversation.startTime)/(1000*60));
        if(props.conversation.end_on){
            duration = Math.ceil((props.conversation.end_on - props.conversation.startTime)/(1000*60));
        }
        this.state = {
            "remark":remarkObj,
            "visits":0,
            "showRemarkInput":false,
            "showTagOpts":false,
            "tags":[],
            "tagName":"",
            duration:duration,
            showTagDelete:false,
            tagColors:tagColorObj,
            tagNames:tagNameObj
        };
    }

    static getPreviewTag(tagName,maxLength){
        if(!maxLength){
            maxLength = 18;
        }
        if(byteLength(tagName)>maxLength){
            tagName = cutString(tagName,maxLength);
        }
        return tagName;
    }


    componentWillReceiveProps(nextProps){
        let duration = Math.ceil((new Date().getTime() - nextProps.conversation.startTime)/(1000*60));
        if(nextProps.conversation.end_on){
            duration = Math.ceil((nextProps.conversation.end_on - nextProps.conversation.startTime)/(1000*60));
        }
        this.state.duration = duration;
        this.setState(this.state);
    }

    componentWillMount(){

    }

    clickDocument(event){
        this.state.showTagOpts = false;
        $(document).unbind('click');
        this.setState(this.state);
    }

    componentDidMount(){
        ConversationStore.addChangeListener(this._onChange.bind(this));
        MessageStore.addChangeListener(this._onChange.bind(this));
        if(!this.props.conversation.end_on){
            this.state.duration = Math.ceil((new Date().getTime() - this.props.conversation.startTime)/(1000*60));
            let that = this;
            that.state.intervalId = setInterval(function(){
                if((!that.props.conversation.state) || (that.props.conversation.state!=="close"&&that.props.conversation.state!=="unreadClose" )){
                    that.state.duration = Math.ceil((new Date().getTime() - that.props.conversation.startTime)/(1000*60));
                    that.setState(that.state);
                }
            },60*1000)
        }
        let that = this;
        ChatWebAPIUtils.getAllAvailableTags(function(data){
            that.state.tags = data;
            that.setState(that.state);
        });
    }

    setRemark(content){
        
        this.state.showRemarkInput = true;
        this.setState(this.state);
        $('textarea.chatting-setting-remark-textarea').val(content);
    }

    componentDidUpdate(){        
        React.findDOMNode(this.refs.remarkTextAreaRef).focus();
    }
    saveRemark(){        
        let value = document.getElementById("remarkTextArea").value;
        let that = this;
        var currentUid = this.props.conversation.uid;
        if(value){
            ChatWebAPIUtils.saveRemark(currentUid,value,function(data){
                ChatServerActionCreator.setRemark(currentUid,value);
            });

            that.state.remark[currentUid] = value;
        }else {
            ChatWebAPIUtils.saveRemark(currentUid,"",function(data){
                ChatServerActionCreator.setRemark(currentUid,"");
            });
            that.state.remark[currentUid] = "";
        }
        that.state.showRemarkInput = false;
        that.setState(that.state);
    }


    _onChange(event) {
    }

    clickSetTag(){
        this.state.showTagOpts = true;
        this.setState(this.state);
        $(document).bind('click', this.clickDocument.bind(this));
    }

    didSetTag(tag){
        let that = this;
        var currUid = this.props.conversation.uid;
        ChatWebAPIUtils.didSetTag(currUid,tag.tag_id,function(data){
            that.state.showTagOpts = false;
            that.state.tagColors[currUid] = colorMap[tag.color];
            that.state.tagNames[currUid] = tag.name;
            that.setState(that.state);
            ChatServerActionCreator.setTag(that.props.conversation.uid,tag)
        });       
    }

    closeDialog(){
        this.props.closeDialog();
    }

    isShowTag(isShow){
        
        this.state.showTagDelete = isShow;
        this.setState(this.state);
    }

    deleteTag(){
        let that = this;
        var currUid = this.props.conversation.uid;
        ChatWebAPIUtils.deleteTag(currUid,function(data){
            that.state.tagColors[currUid] = "";
            that.state.tagNames[currUid] = "";
            that.setState(that.state);
            ChatServerActionCreator.deleteTag(that.props.conversation.uid)
        });
    }

    isFromHistory(){
        return this.props.conversation && this.props.conversation.msglist
    }

    componentWillUnmount() {
        if(this.state.intervalId){
            clearInterval(this.state.intervalId);
        }
    }

    render(){
        let tagsDialogOpts =[];
        for(let i in this.state.tags){
            let tag = this.state.tags[i];
            let key = "tag_" + tag.tag_id;
            tagsDialogOpts.push(<div key={key} onClick={this.didSetTag.bind(this,tag)}>
                <span className={colorMap[tag.color]} >{RightInfoPanel.getPreviewTag(tag.name)}</span>
            </div>)
        }


        let tagsDialog = <div className={classNames({"chatTag-chg":true,"hide":!this.state.showTagOpts})}>
            {tagsDialogOpts}
        </div>


        let tag = "";
        if(this.props.readOnly){
                //首次
                 if(typeof(this.state.tagColors[this.props.conversation.uid]) == "undefined"){
                    if(this.props.conversation.somaUser.tag){
                        this.state.tagColors[this.props.conversation.uid] = colorMap[this.props.conversation.somaUser.tag.color];
                        this.state.tagNames[this.props.conversation.uid] = this.props.conversation.somaUser.tag.name;
                    }
                    else{
                        this.state.tagColors[this.props.conversation.uid] = "";
                        this.state.tagNames[this.props.conversation.uid] = "";
                    }
                    
                }
                if( this.state.tagColors[this.props.conversation.uid] != ""){
                    
                    let tagClassName ="group-level "+  this.state.tagColors[this.props.conversation.uid];
                    let imgSrc = require('static/images/chat/icon_deleteTag.png');
                    let deleteIcon = this.state.showTagDelete?<img src={imgSrc} onClick={this.deleteTag.bind(this)}/>:null;

                    tag = <div className={tagClassName} onMouseOver={this.isShowTag.bind(this,true)} onMouseLeave={this.isShowTag.bind(this,false)}>
                        <span className={classNames({"delete":this.state.showTagDelete})}>{RightInfoPanel.getPreviewTag( this.state.tagNames[this.props.conversation.uid])}</span>
                        {deleteIcon}
                    </div>;
               
                }
                
            }
            else if(this.props.conversation.somaUser.tag){

                let tagClassName ="group-level "+ (this.props.conversation.somaUser.tag.color?colorMap[this.props.conversation.somaUser.tag.color]:"");
                let imgSrc = require('static/images/chat/icon_deleteTag.png');
                let deleteIcon = this.state.showTagDelete?<img src={imgSrc} onClick={this.deleteTag.bind(this)}/>:null;
                tag = <div className={tagClassName} onMouseOver={this.isShowTag.bind(this,true)} onMouseLeave={this.isShowTag.bind(this,false)}>
                    <span className={classNames({"delete":this.state.showTagDelete})}>{RightInfoPanel.getPreviewTag(this.props.conversation.somaUser.tag.name)}</span>
                    {deleteIcon}
                </div>;
        }

        let closeElement = this.props.readOnly?<div className="chatting-setting-close" >
            <span className="chatting-setting-close-btn" onClick={this.closeDialog.bind(this)} ></span>
        </div>:null;
	
        //两个会话时，首次第二个点击的会话的remark还没有做存储，需要从conversation获取
        if(typeof(this.state.remark[this.props.conversation.uid]) == "undefined"){
            this.state.remark[this.props.conversation.uid] = this.props.conversation.somaUser.remark;
        }
        let remarkContent = this.state.remark[this.props.conversation.uid];      
       
        let remarkTitle = Lang.str("app_chat_Remark") + ":";
        return (
            <div className="chatting-setting">
                {closeElement}
                <div className="chatting-setting-info">
                <div className="chatting-setting-group">
                    <div className="group-tit">{Lang.str("app_chat_VisitInformation")}</div>
                    <div className="group-content">
                        <p>
                            <label>{Lang.str("app_chat_Visits") +":"}</label>
                            <span>{this.props.conversation.somaUser.visits}</span>
                        </p>
                        <p>
                            <label>{Lang.str("app_chat_DurationPerVisit") +":"}</label>
                            <span>{this.state.duration+" min"} </span>
                        </p>
                        <p>
                            <label>{Lang.str("app_chat_Source") +":"}</label>
                            <span>{this.props.conversation.source} </span>
                        </p>
                    </div>
                </div>
                <div className="chatting-setting-group">
                    <div className="group-tit">{Lang.str("app_chat_UserInformation")}</div>
                    <div className="group-content">
                        <p>
                            <label>{Lang.str("app_chat_SOMAName")+":"}</label>
                            <span className="userName">{this.props.conversation.somaUser.name}</span>
                        </p>
                        <p className="set-remark">
                            <label>{remarkTitle}</label>
                            <span className={classNames({"chatting-setting-remark":true,"hide":this.state.showRemarkInput})} onClick={this.setRemark.bind(this, remarkContent)}>{remarkContent}</span>
                            {<span  className={classNames({"chatting-setting-remark-input":true,"hide":!this.state.showRemarkInput})}><textarea className="chatting-setting-remark-textarea" maxLength="50"  placeholder={Lang.str("app_chat_Remark_add")} ref="remarkTextAreaRef"  id="remarkTextArea" defaultValue={remarkContent}  onBlur={this.saveRemark.bind(this)}/></span>}
                        </p>
                    </div>
                </div>

                <div className="chatting-setting-group" id="settag">
                    {tag || (!$.isEmptyObject(this.state.tags))?<div className="group-tit">{Lang.str("app_chat_UserInformation_Tag")}</div>:null}
                    {tag}
                    {($.isEmptyObject(this.state.tags))?"":<div className="tag-add" onClick={this.clickSetTag.bind(this)}>
                        <a>{Lang.str("app_chat_SetUserTag")}</a>
                        {tagsDialog}
                    </div>}
                </div>
                </div>
            </div>
        );
    }

}

export default RightInfoPanel;