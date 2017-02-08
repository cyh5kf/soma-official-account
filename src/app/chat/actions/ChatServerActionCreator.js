import ChatDispatcher from 'app/chat/dispatcher/ChatDispatcher'
import ChatConstants from 'app/chat/constants/ChatConstants'
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import Session from "app/Session"
import ConversationStore from "app/chat/stores/ConversationStore"
import Lang from "lang/Lang"
import log from "loglevel"





var ActionTypes = ChatConstants.ActionTypes;

export class ChatServerActionCreator{
    //刚开始加载时load所有的对话列表
    receiveConversations(rawMessages){
        ChatDispatcher.dispatch({
            type: ActionTypes.RECEIVE_INIT_CONVERSATIONS,
            rawMessages: rawMessages
        });
    }

    syncMessage(rawMessages){
        ChatDispatcher.dispatch({
            type: ActionTypes.SYNC_MESSAGE,
            rawMessages: rawMessages
        });
    }

    //切换自己和同事的对话列表
    clickChangePanel(){
        ChatDispatcher.dispatch({
            type: ActionTypes.CLICK_CHANGE_PANNEL,
        });
    }

    //点击切换对话
    clickConversation(uid,conv_id){
        ChatDispatcher.dispatch({
            type: ActionTypes.CLICK_CONVERSATION,
            uid:uid,
            conv_id:conv_id
        });
    }


    /**
     * 发送正在发送的消息
     * @param sendingMessage 正在发送的消息
     */
    createSendingTextMessage(sendingMessage){
        ChatDispatcher.dispatch({
            type: ActionTypes.SENDING_MESSAGE,
            rawMessage: sendingMessage
        });
        var successCallBack = function( data, textStatus, jqXHR ){
            if(jqXHR.status != 200){
                ChatDispatcher.dispatch({
                    type: ActionTypes.SEND_MESSAGE_FAILED,
                    sendingMessage: sendingMessage
                });
            }else {
                sendingMessage.realTime=data
                ChatDispatcher.dispatch({
                    type: ActionTypes.SEND_MESSAGE_SUCCESS,
                    sendingMessage: sendingMessage
                });
            }
        }
        var failedCallBack = function(jqXHR, textStatus, errorThrown ){
            ChatDispatcher.dispatch({
                type: ActionTypes.SEND_MESSAGE_FAILED,
                sendingMessage: sendingMessage
            });
        }
        ChatWebAPIUtils.sendMessage(sendingMessage,successCallBack,failedCallBack)
    }




    //重发失败消息
    resendFailedMessage(message){
        ChatDispatcher.dispatch({
            type: ActionTypes.RESEND_FAILED_MESSAGE,
            rawMessage: message
        });
        if(message.content_type == 2){
            this.resendTextMessage(message);
        }else if(message.content_type == 3){
            this.resendImageMessage(message);
        }
    }

    resendImageMessage(sendingMessage){
        this.createSendingImageMessage(sendingMessage);
    }

    resendTextMessage(message){
        var successCallBack = function( data, textStatus, jqXHR ){
            if(jqXHR.status != 200){
                ChatDispatcher.dispatch({
                    type: ActionTypes.SEND_MESSAGE_FAILED,
                    sendingMessage: message
                });
            }else {
                message.realTime=data
                ChatDispatcher.dispatch({
                    type: ActionTypes.SEND_MESSAGE_SUCCESS,
                    sendingMessage: message
                });
            }
        }

        var failedCallBack = function(jqXHR, textStatus, errorThrown ){
            ChatDispatcher.dispatch({
                type: ActionTypes.SEND_MESSAGE_FAILED,
                sendingMessage: message
            });
        }
        ChatWebAPIUtils.sendMessage(message,successCallBack,failedCallBack)
    }




    createSendingImageMessage(sendingMessage){
        let image = sendingMessage.image,
            fileToLoad = sendingMessage.fileToUpload;
        let compressedImage = image;
        console.log("fileToLoad.size",fileToLoad);
        if(fileToLoad.size>1024*1024){//大于1M上传时启用压缩
            console.log("fileToLoad",fileToLoad.name);
            let outputFormat = fileToLoad.name.split(".").pop();
            if(!outputFormat){
                outputFormat = "jpg";
            }
            compressedImage = this.compressFile(image,40,outputFormat);
        }
        var successfulCallBack = function(ret){
            let data = JSON.parse(ret);
            console.log("successfulCallBack",data.data)
            if(data.data.ret != 200){
                ChatDispatcher.dispatch({
                    type: ActionTypes.SEND_MESSAGE_FAILED,
                    sendingMessage: sendingMessage
                });
            }else {
                ChatDispatcher.dispatch({           
                    type: ActionTypes.SEND_MESSAGE_SUCCESS,
                    sendingMessage: sendingMessage
                });
            }
        }
        ChatDispatcher.dispatch({
            type: ActionTypes.SENDING_MESSAGE,
            rawMessage: sendingMessage
        });
        var failCallBack = function(){
            log.debug("failCallBack")
            ChatDispatcher.dispatch({
                type: ActionTypes.SEND_MESSAGE_FAILED,
                sendingMessage: sendingMessage
            });
        }
        this.upload(compressedImage,"/upload/file5/upload/official.json?aid="+Session.getAid()+"&touid="+ConversationStore.getCurrentConversation().uid+"&type=image&oid="+Session.getOid(),
        "file",fileToLoad.name,successfulCallBack,failCallBack);
    }


    compressFile (source_img_obj, quality, output_format){
        var mime_type = "image/jpeg";
        if(typeof output_format !== "undefined" && output_format=="png"){
            mime_type = "image/png";
        }
        if(typeof output_format !== "undefined" && output_format=="jpg"){
            mime_type = "image/jpg";
        }
        var cvs = document.createElement('canvas');
        cvs.width = source_img_obj.naturalWidth;
        cvs.height = source_img_obj.naturalHeight;
        let ratio = 1;
        if(cvs.width > 2048){
            ratio = 2048/cvs.width;
        }
        if(cvs.height>1536){
            if(ratio < 1536/cvs.height){
                ratio = 1536/cvs.height;
            }
        }
        cvs.width = cvs.width*ratio;
        cvs.height = cvs.height*ratio;

        var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0, cvs.width,cvs.height);
        var newImageData = cvs.toDataURL(mime_type,quality/100);
        var result_image_obj = new Image();
        result_image_obj.src = newImageData;
        return result_image_obj;
    }



    /**
     * Receives an Image Object and upload it to the server via ajax
     * @param {Image} compressed_img_obj The Compressed Image Object
     * @param {String} The server side url to send the POST request
     * @param {String} file_input_name The name of the input that the server will receive with the file
     * @param {String} filename The name of the file that will be sent to the server
     * @param {function} successCallback The callback to trigger when the upload is succesful.
     * @param {function} (OPTIONAL) errorCallback The callback to trigger when the upload failed.
     * @param {function} (OPTIONAL) duringCallback The callback called to be notified about the image's upload progress.
     * @param {Object} (OPTIONAL) customHeaders An object representing key-value  properties to inject to the request header.
     */

    upload(compressed_img_obj, upload_url, file_input_name, filename, successCallback, errorCallback, duringCallback, customHeaders){
            var cvs = document.createElement('canvas');
            cvs.width = compressed_img_obj.naturalWidth;
            cvs.height = compressed_img_obj.naturalHeight;
            var ctx = cvs.getContext("2d").drawImage(compressed_img_obj, 0, 0);

            //ADD sendAsBinary compatibilty to older browsers
            if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
                XMLHttpRequest.prototype.sendAsBinary = function(string) {
                    var bytes = Array.prototype.map.call(string, function(c) {
                        return c.charCodeAt(0) & 0xff;
                    });
                    this.send(new Uint8Array(bytes).buffer);
                };
            }

            var type = "image/jpeg";
            var suffix = filename.substr(-4);

            if(suffix && suffix.toUpperCase()==".PNG"){
                type = "image/png";
            }

            var data = cvs.toDataURL(type);
            data = data.replace('data:' + type + ';base64,', '');

            var xhr = new XMLHttpRequest();
            xhr.open('POST', upload_url, true);
            var boundary = 'someboundary';

            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

            // Set custom request headers if customHeaders parameter is provided
            if (customHeaders && typeof customHeaders === "object") {
                for (var headerKey in customHeaders){
                    xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
                }
            }

            // If a duringCallback function is set as a parameter, call that to notify about the upload progress
            if (duringCallback && duringCallback instanceof Function) {
                xhr.onprogress = function (evt) {
                    if (evt.lengthComputable) {
                        return (evt.loaded / evt.total)*100;
                    }
                };
            }

            xhr.sendAsBinary(['--' + boundary, 'Content-Disposition: form-data; name="' + file_input_name + '"; filename="' + filename + '"', 'Content-Type: ' + type, '', atob(data), '--' + boundary + '--'].join('\r\n'));

            xhr.onreadystatechange = function() {
                if (this.readyState == 4){
                    if (this.status == 200) {
                        successCallback(this.responseText);
                    }else if (this.status >= 400) {
                        if (errorCallback &&  errorCallback instanceof Function) {
                            errorCallback(this.responseText);
                        }
                    }
                }
            };
    }

    /**
     * 接收到消息
     * @param receivedMessage
     */
    receiveMessage(receivedMessage){
        ChatDispatcher.dispatch({
            type: ActionTypes.RECEIVE_MESSAGE,
            receivedMessage: receivedMessage
        });
    }

    /**
     * 点击load更多消息
     */
    clickLoadMoreMessage(uid,maxtime,that,count){
        var successCallBack = function(receivedMessage){
            log.debug("receivedMessage",receivedMessage)
            that.state.showLoadingMore = false;
            that.state.scrollDirection = "top";
            if(receivedMessage.length === 0){
                that.state.scrollTopEnd = true;
            }else {
                that.state.scrollTopEnd = false;
            }
            ChatDispatcher.dispatch({
                type: ActionTypes.LOAD_MORE_MESSAGES,
                receivedMessage: receivedMessage,
                uid:uid
            });

            // that.setState(that.state);
        }
        ChatWebAPIUtils.getMoreMessage(uid,maxtime,successCallBack,count);
    }

    /**
     * 结束会话
     * @param uid
     */
    endChat(uid){
        var successCallBack = function(data, textStatus, jqXHR){
            ChatDispatcher.dispatch({
                type: ActionTypes.END_CONVERSATION,
                uid:uid
            });
            ChatDispatcher.dispatch({
                type: ActionTypes.REMINDER,
                reminderObj:{
                    showReminder:true,
                    reminderType:"success",
                    reminderWord:Lang.str("app_chat_endConversationSuccess")
                }
            });
            setTimeout(function(){
                ChatDispatcher.dispatch({
                    type: ActionTypes.REMINDER,
                    reminderObj:{
                        showReminder:false,
                        reminderType:"success",
                        reminderWord:Lang.str("app_chat_endConversationSuccess")
                    }
                });
            },1000);

        }
        ChatWebAPIUtils.closeConversation(uid,successCallBack);
    }

    transferConversationSuccess(uid,agent){
        ChatDispatcher.dispatch({
            type: ActionTypes.TRANSFER_CONVERSATION,
            uid:uid,
            agent:agent
        });
        ChatDispatcher.dispatch({
            type: ActionTypes.REMINDER,
            reminderObj:{
                showReminder:true,
                reminderType:"success",
                reminderWord:Lang.str("app_chat_transferConversationSuccess")
            }
        });
        setTimeout(function(){
            ChatDispatcher.dispatch({
                type: ActionTypes.REMINDER,
                reminderObj:{
                    showReminder:false,
                    reminderType:"success",
                    reminderWord:Lang.str("app_chat_transferConversationSuccess")
                }
            });
        },1000);
    }
    transferConversationFailed(){
        ChatDispatcher.dispatch({
            type: ActionTypes.REMINDER,
            reminderObj:{
                showReminder:true,
                reminderType:"failed",
                reminderWord:Lang.str("app_chat_TransferFailed")
            }
        });
        setTimeout(function(){
            ChatDispatcher.dispatch({
                type: ActionTypes.REMINDER,
                reminderObj:{
                    showReminder:false,
                    reminderType:"failed",
                    reminderWord:Lang.str("app_chat_TransferFailed")
                }
            });
        },1000);
    }


    setRemark(uid,remark){
        ChatDispatcher.dispatch({
            type: ActionTypes.SET_REMARK,
            uid:uid,
            remark:remark
        });
    }

    setTag(uid,tag){
        ChatDispatcher.dispatch({
            type: ActionTypes.SET_TAG,
            uid:uid,
            tag:tag
        });
    }

    killOutUser(){
        ChatDispatcher.dispatch({
            type: ActionTypes.KICK_OUT
        });
    }

    clearStores(){
        ChatDispatcher.dispatch({
            type: ActionTypes.CLEAR_STORE
        });
    }
    
    deleteTag(uid){
        ChatDispatcher.dispatch({
            type: ActionTypes.DELETE_TAG,
            uid:uid
        });
    }

    transitionToChatPage(){
        ChatDispatcher.dispatch({
            type: ActionTypes.TRANSITION_TO_CHAT
        });
    }
}

var chatServerActionCreator = new ChatServerActionCreator();

export default chatServerActionCreator;

