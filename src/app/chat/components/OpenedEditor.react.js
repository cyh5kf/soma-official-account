import React from 'react'
import MessageStore from "app/chat/stores/MessageStore"
import ConversationStore from "app/chat/stores/ConversationStore"
import auth from "app/Session"
import ChatConstants from 'app/chat/constants/ChatConstants'
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import QuickReply from "app/chat/components/QuickReply.react"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import EmojiPicker from "utils/EmojiPicker"

import emoji from "js-emoji"
import $ from "jquery"
import Lang from "lang/Lang"
import Session from "app/Session"
import timeHelper from "utils/TimeHelper"






var MessageSentStatus = ChatConstants.MessageSentStatus;

var ENTER_KEY_CODE = 13;//回车键


export class OpenedEditor extends React.Component{
    constructor(props) {
        super(props);
        this.state = {"showEmojiPopup":false,
            "showQuickReplyPopup":false,
            "quickReplyData":{"enterp":[],"agent":[],
                "uid":this.props.conversation.uid
            }
        };
    };

    componentWillMount(){
        require.ensure([], function() {
            require('static/css/emoji/lib/css/nanoscroller.css');
            require('static/css/emoji/lib/css/emoji.css');
        }.bind(this));
    }



     componentDidUpdate(){
         if(this.state.uid != this.props.conversation.uid){
             $(".emoji-wysiwyg-editor").html('')
             this.state.uid = this.props.conversation.uid;
             $(".emoji-wysiwyg-editor").focus();
         }
     }

    componentDidMount(){
        ConversationStore.addChangeListener(this._onChange.bind(this));
        // Initializes and creates emoji set from sprite sheet
        window.emojiPicker = new EmojiPicker({
            emojiable_selector: '[data-emojiable=true]',
            assetsPath: 'http://d51wm8y7a2ot9.cloudfront.net/official-account/emoji/img',
            popupButtonClasses: 'fa fa-smile-o',
            popUpOffSet:"220px 12px",
            norealTime:false,
            iconSize:20
        });
        // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
        // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
        // It can be called as many times as necessary; previously converted input fields will not be converted again
        window.emojiPicker.discover();

        $(".emoji-wysiwyg-editor").on("keyup keydown keypress",function(event){
            if (event.keyCode === ENTER_KEY_CODE) {
                event.preventDefault();
                var text = document.getElementById("chattingTextArea").value;
                if (text) {
                    emoji.text_mode = false;
                    emoji.img_set = 'apple';
                    emoji.replace_mode = "unified";
                    text = emoji.replace_colons(text);
                    let currentConversation = ConversationStore.getCurrentConversation();
                    let message = {
                        uid:currentConversation.uid,
                        aid:parseInt(Session.getAid()),
                        msg_type:1,
                        msg_time:(new Date()).valueOf()+timeHelper.getTimeDifference(),
                        from_soma:0,
                        content_type:2,
                        content:text,
                        is_internal:0,
                        from_nickname:auth.agentName,
                        somaUserName:currentConversation.somaUser.name,
                        status:MessageSentStatus.SENDING
                    }
                    ChatServerActionCreator.createSendingTextMessage(message);
                }
                $(".emoji-wysiwyg-editor").html('')
            }
        })

        $(".emoji-wysiwyg-editor").on("keypress",function(event){
            let currentConversation = ConversationStore.getCurrentConversation();
            let typingMessage = {
                uid:currentConversation.uid,
                aid:parseInt(Session.getAid()),
                msg_type:1,
                msg_time:(new Date()).valueOf()+timeHelper.getTimeDifference(),
                from_soma:0,
                content_type:5,
                is_internal:0,
                content:"",
                from_nickname:auth.agentName,
                somaUserName:currentConversation.somaUser.name,
                status:MessageSentStatus.SENDING
            }
            ChatWebAPIUtils.sendMessage(typingMessage);
            console.log("typing typing")
        });
        $.fn.focusEnd = function() {
            $(this).focus();
            var tmp = $('<span />').appendTo($(this)),
                node = tmp.get(0),
                range = null,
                sel = null;
            if (document.selection) {
                range = document.body.createTextRange();
                range.moveToElementText(node);
                range.select();
            } else if (window.getSelection) {
                range = document.createRange();
                range.selectNode(node);
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
            tmp.remove();
            return this;
        }
        $('[contenteditable]').on('paste',function(e) {
            var content;
            e.preventDefault();
            var text = document.getElementById("chattingTextArea").value;
            emoji.text_mode = false;
            emoji.img_set = 'apple';
            emoji.replace_mode = "unified";
            text = emoji.replace_colons(text);

            if( e.originalEvent.clipboardData ){
                content = (e.originalEvent || e).clipboardData.getData('text/plain');
                if(text.length + content.length > 1000){
                    return;
                }
                document.execCommand('insertText', false, content);
            }
            else if( window.clipboardData ){
                content = window.clipboardData.getData('Text');
                if(text.length + content.length > 1000){
                    return;
                }
                if (window.getSelection)
                    window.getSelection().getRangeAt(0).insertNode( document.createTextNode(content) );
            }
        });

        $(".emoji-wysiwyg-editor").focus();
    }

    _onChange(){
        if(ConversationStore.getFocusEditor()){
            $(".emoji-wysiwyg-editor").focus();
            ConversationStore.resetFocusEditor();
        }
    }

    componentWillUnmount() {
        ConversationStore.removeChangeListener(this._onChange.bind(this));
    }


    clickQuickReplyPopup(){
        let that = this;
        var successHandler = function(data){
            that.state.quickReplyData = data;
            that.state.showQuickReplyPopup = true;
            that.setState(that.state);
        }

        ChatWebAPIUtils.getAllQuickList(successHandler);


        $(document).bind('click', this.clickQuickReplyDocument.bind(this));
    }


    clickQuickReplyDocument(event){
        if($(event.target).hasClass('chat-reply-accordion') || $(event.target).parents(".chat-reply-accordion").size()){
            return ;
        }

        this.state.showQuickReplyPopup = false;
        this.setState(this.state);
        $(document).unbind('click', this.clickQuickReplyDocument.bind(this));
    }



    onClickEmoji(emoji){
        document.getElementById("chattingTextArea").value += emoji;
    }

    onClickQuickReply(content){
        this.state.showQuickReplyPopup = false;
        this.setState(this.state);
        $(".emoji-wysiwyg-editor").append(content);
        $(".emoji-wysiwyg-editor").focusEnd();
    }




    render(){
        let placeHolder = this.props.conversation.aid+""===Session.getAid() ? Lang.str("app_chat_PleaseEnter"):Lang.str("app_chat_HelpHimOrHer");
        return (
            <div className="chatting-holder-editor">
                <div className="editor-options">
                    <div className="optionsL">
                        <a >
                            <label class="emotions"></label>
                        </a>
                        <a>
                            <label for="file-upload" className="fileSelect">
                                <input id="file-upload" className="chatting-image-upload" ref="uploadFile" type="file" accept="image/jpeg,image/gif,image/png,image/bmp" onChange={this.uploadFile.bind(this)} />
                            </label>
                        </a>
                        <a onClick={this.clickQuickReplyPopup.bind(this)}>
                            <label className="reply" ></label>
                        </a>
                        <QuickReply onClickQuickReply={this.onClickQuickReply.bind(this)} quickReplyData={this.state.quickReplyData} showQuickReplyPopup={this.state.showQuickReplyPopup}></QuickReply>
                    </div>
                </div>
                <div className="editor-content">
                    <textarea id="chattingTextArea"  maxLength="1000" placeholder={placeHolder} data-emojiable={true}></textarea>
                </div>
            </div>
        )
    }

    uploadFile(event){
        let that = this;
        let fileToLoad = event.target.files[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent)
        {
            console.log("fileToLoad",fileToLoad)
            var img = new Image;
            img.src = fileLoadedEvent.target.result;
            img.onload = function() {
                let content = {"imgprevurl":fileLoadedEvent.target.result,"imgurl":fileLoadedEvent.target.result,"filesize":fileToLoad.size,"imgwidth":img.width,"imgheight":img.height};
                let currentConversation = ConversationStore.getCurrentConversation();
                let message = {
                    uid:currentConversation.uid,
                    aid:auth.getAid(),
                    msg_type:1,
                    msg_time:(new Date()).valueOf()+timeHelper.getTimeDifference(),
                    from_soma:0,
                    content_type:3,
                    content:JSON.stringify(content),
                    is_internal:0,
                    from_nickname:auth.getName(),
                    somaUserName:currentConversation.somaUser.name,
                    status:MessageSentStatus.SENDING,
                    fileToUpload:fileToLoad,
                    image:this
                }
                ChatServerActionCreator.createSendingImageMessage(message);
            };

        };
        fileReader.readAsDataURL(fileToLoad);
        React.findDOMNode(this.refs.uploadFile).value = "";
    }

}

export  default OpenedEditor;