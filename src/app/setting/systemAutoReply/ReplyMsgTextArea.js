import React from 'react'
import $ from 'jquery'
import Lang from "lang/Lang"
import SystemAutoReplyApiUtil from 'app/setting/systemAutoReply/SystemAutoReplyApiUtil'

export class ReplyMsgTextArea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {content:this.props.content,field:this.props.field};
    }


    componentDidMount() {
        //this.setState({field: this.props.field, rawContent: this.props.content, content: this.props.content});
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps",nextProps);
        this.setState({filed: nextProps.field, rawContent: nextProps.content, content: nextProps.content});
    }

    handleAutoTextarea(elem, extra, maxHeight) {
            extra = extra || 0;
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                    elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                    var val = elem.currentStyle[name];

                    if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                            parseFloat(getStyle('paddingTop')) -
                            parseFloat(getStyle('paddingBottom')) + 'px';
                    };

                    return val;
                } : function (name) {
                    return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));


            elem.style.resize = 'none';

            var change = function () {
                var scrollTop, height,
                    padding = 0,
                    style = elem.style;

                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;

                if (!isFirefox && !isOpera) {
                    padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    };
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                };
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
    }

    handleMouseEvent(mouseAction,e) {
        this.state.mouseAction = mouseAction;
        var self = this;
        var curTarget = $(e.currentTarget);
        var field = this.props.field;
        var selectedBox = curTarget.prevAll(".messageContentWrap");
        var content = selectedBox.text();
        if (mouseAction == 'save') {
            var successcb = function (data, txtStatus, xhr) {
                if (xhr.status == 200) {
                    this.state.rawContent = this.state.content;
                } else {
                    this.state.content = this.state.rawContent;
                }
                this.props.afterSaveSuccess(field, this.state.content);
            };
            SystemAutoReplyApiUtil.updateReplyMsg(field, this.state.content, successcb.bind(this));
            selectedBox.removeClass("scriptionMessageEditing");
            $.messageBox({"message":Lang.str('app_setting_systemAutoReply_ChangeSaved'),"level":"success"});
        }else if (mouseAction==='cancel'){
            selectedBox.removeClass("scriptionMessageEditing");
            this.state.content = this.state.rawContent;
            //document.querySelector(".textContent").removeAttribute("onBlur");
            this.forceUpdate();
        } else {
            selectedBox.addClass("scriptionMessageEditing");
            this.forceUpdate(function(){
                var textArea = $("#setting_detail .textContent");
                if (textArea&&textArea.length>0){
                    $.each(textArea,function(i,v){
                        self.handleAutoTextarea(v);
                    })
                }
            });
        }
    }

    changeText(event) {
        this.state.content = event.target.value;
        this.setState(this.state);
    }

    render() {
        var mouseAction = this.state.mouseAction;
        if(this.props.field == "manual_end_conv_msg"){
            if (mouseAction == 'modify') {
                return (
                    <div className="message borderNoBottom">
                        <textarea className="textContent" id={this.props.field} onChange={this.changeText.bind(this)} value={this.state.content}></textarea>
                        <a href="#" className="save_btn" style={{display:"inline-block"}} data-action="save" onClick={this.handleMouseEvent.bind(this, 'save')}></a>
                        <a href="#" className="cancel_btn" style={{display:"inline-block"}} data-action="cancel" onClick={this.handleMouseEvent.bind(this, 'cancel')}></a>
                    </div>
                );
            } else {
                return <div className="message borderNoBottom">
                    <div className="messageContentWrap toggle_color">
                        {this.state.content}
                        <a href="#" className="modify_btn" data-action="modify" onClick={this.handleMouseEvent.bind(this, 'modify')}></a>
                    </div>

                </div>
            }
        } else {
            if (mouseAction == 'modify') {
                return (
                    <div className="message">
                        <textarea className="textContent" id={this.props.field} onChange={this.changeText.bind(this)} value={this.state.content}></textarea>
                        <a href="#" className="save_btn" style={{display:"inline-block"}} data-action="save" onClick={this.handleMouseEvent.bind(this, 'save')}></a>
                        <a href="#" className="cancel_btn" style={{display:"inline-block"}} data-action="cancel" onClick={this.handleMouseEvent.bind(this, 'cancel')}></a>
                    </div>
                );
            } else {
                return <div className="message">
                    <div className="messageContentWrap toggle_color">
                        {this.state.content}
                        <a href="#" className="modify_btn" data-action="modify" onClick={this.handleMouseEvent.bind(this, 'modify')}></a>
                    </div>

                </div>
            }
        }

    }
}

export default ReplyMsgTextArea;    