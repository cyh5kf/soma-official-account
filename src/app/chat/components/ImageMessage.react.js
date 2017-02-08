import React from 'react'
import classNames from 'classnames/bind';
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import ChatConstants from 'app/chat/constants/ChatConstants'



var MessageSentStatus = ChatConstants.MessageSentStatus;

export class ImageMessage extends React.Component{
    constructor(props) {
        super(props);
    };
    componentDidMount(){
    }

    componentWillUnmount(){
    }

    getPreviewPic(imgObject) {
        if(imgObject.imgurl.startsWith("http")){
            var widthAndHeight = this.getWithAndHeight(imgObject.imgwidth,imgObject.imgheight);
            widthAndHeight = "_"+widthAndHeight.width +"x"+ widthAndHeight.height;
            return imgObject.imgurl.substring(0,imgObject.imgurl.length-imgObject.imgurl.split(".").pop().length-1)+widthAndHeight+"."+imgObject.imgurl.split(".").pop()
        }else {
            return imgObject.imgurl;
        }
    }

    getWithAndHeight(width,height){
        if(width <300 || height<300){
            return {width:width,height:height};
        }else {
            if(width>height){
                var propotion = height/300;
                height = 300;
                width = width/propotion;
            }else {
                var propotion = width/300;
                width = 300;
                height = height/propotion;
            }
            return {width:Math.floor(width),height:Math.floor(height)};
        }
    }

    resendFailedMessage(message,status){
        console.log("resendFailedMessage",message);
        if(status === MessageSentStatus.FAILED){
            ChatServerActionCreator.resendFailedMessage(message)
        }
    }



    render(){
        let imageObject = JSON.parse(this.props.message.content);
        if(!imageObject.imgurl){
            imageObject.imgurl = imageObject.origimgurl;
        }
        if(!imageObject.imgwidth){
            imageObject.imgwidth = imageObject.origimgwidth;
        }

        if(!imageObject.imgheight){
            imageObject.imgheight = imageObject.origimgheight;
        }

        let widthAndHeight = this.getWithAndHeight(imageObject.imgwidth,imageObject.imgheight);
        let imageHtml =  <img className="chatting-msg-photo" src={imageObject.imgurl} alt="photo" />;
        if(!imageObject.imgurl.startsWith("http")){
            imageHtml = <img className="chatting-msg-photo" src={this.getPreviewPic(imageObject)} alt="photo" width={widthAndHeight.width} height={widthAndHeight.height} />
        }else {
            if(imageObject.imgwidth > 300 || imageObject.origimgwidth>300){
                imageHtml = <img className="chatting-msg-photo" src={this.getPreviewPic(imageObject)} alt="photo" width={widthAndHeight.width} height={widthAndHeight.height} />
            }
        }
        let msgStatusHtml = <span onClick={this.resendFailedMessage.bind(this,this.props.message,this.props.message.status)} className= {classNames( {"chatting-msg-status":true,
                    "chatting-msg-status-loading":this.props.message.status === MessageSentStatus.SENDING,
                    "chatting-msg-status-failed":this.props.message.status === MessageSentStatus.FAILED
                    })} style={{"top":Math.floor((widthAndHeight.height-15)/2) + "px"}}></span>
        return  <div className="photo" >
            <a className="chat-img-photo-a" href={imageObject.imgurl} target="_blank" >
                {imageHtml}
            </a>
            <div className="chat-img-empty" style={{"width":widthAndHeight.width,"height":widthAndHeight.height}}>
            </div>
            {msgStatusHtml}
        </div>

    }
}
export default ImageMessage;

