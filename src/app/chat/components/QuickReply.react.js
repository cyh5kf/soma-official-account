import React from 'react'
import classNames from 'classnames/bind';
import Lang from "lang/Lang"
import ChattingPullRightHover from "app/chat/components/ChattingPullRightHover.react"


export class QuickReply extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            "collapses":{},
            isHoverQuickReply: false,
            hoverQuickReplyContent:'',
            hoverTipsY:0,
        }
    };

    clickSelect(id){
        let toSet = !this.state.collapses[id];
        this.state.collapses[id] = toSet;
        this.setState(this.state)
    }

    clickQuickReply(content){
        this.props.onClickQuickReply(content)
    }

    onMouseHover(e){
        if($(e.target).attr("id")=="a-content") {
            this.state.isHoverQuickReply = true;
            this.state.hoverQuickReplyContent = ($(e.target).attr("value"));

            var mTop = $(e.target).offset().top;
            var wTop =  $('.div-chat-qr').offset().top;

            this.state.hoverTipsY = (mTop - wTop);
            this.setState(this.state);
        }
    }

    onMouseLeave(e){
        this.state.isHoverQuickReply = false;
       this.state.hoverTipsY=0;
       this.state.hoverQuickReplyContent = "";

        this.setState(this.state);
    }

    render(){
        let enterPrizeQuickReplyHtml = [];
        for(let k in ["enterp","agent"]){
            let c = ["enterp","agent"][k];
            for(let i in this.props.quickReplyData[c]){
                let category = this.props.quickReplyData[c][i];
                let subMenuHtml = []
                if(category.hasOwnProperty("content")){
                    for(let j in category.content){
                        subMenuHtml.push(<li className="li-quickreply">
                            <a id="a-content" href="#"  onMouseLeave={this.onMouseLeave.bind(this)} onMouseOver={this.onMouseHover.bind(this)} onClick={this.clickQuickReply.bind(this,category.content[j].content)} value={category.content[j].content}><span className="chatting-quickreply-namespan">{category.content[j].name}</span></a>

                        </li>
                    )
                    }
                }
                enterPrizeQuickReplyHtml.push(<li className="chat-reply-accordion-li">
                    <div className={classNames({"link":true,"open":(!this.state.collapses[category.category_id])})} onClick={this.clickSelect.bind(this,category.category_id)}><i className={classNames({"grpTit":true,"open":this.state.collapses[category.category_id]})}></i><span className="chat-reply-accordion-span">{category.name}</span><i className="grpTit-mark"></i></div>
                    <ul className="submenu">
                        {subMenuHtml}
                    </ul>
                </li>)
            }
        }

        if(enterPrizeQuickReplyHtml.length === 0){
            return  <div className={classNames({"empty-quick-reply":true,"hide":!this.props.showQuickReplyPopup})}>
                <span>{Lang.str("app_chat_EmptyQuickReply")}</span>
            </div>
        }else {
            return (
                    <div className="div-chat-qr">
                <ul className={classNames({"chat-reply-accordion":true,"hide":!this.props.showQuickReplyPopup})}>
                    {enterPrizeQuickReplyHtml}
                </ul>
            {(this.state.isHoverQuickReply )?<ChattingPullRightHover text={this.state.hoverQuickReplyContent} type="quickreply" posy = {this.state.hoverTipsY}></ChattingPullRightHover>:null}
                </div>
            )
        }
    }
    cutString(s){
        return s.length > length ?
        s.substring(0, length - 3) + "..." :
            s.substring(0, length);
    }
}



export default QuickReply;