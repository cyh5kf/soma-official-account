/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import Lang from "lang/Lang"

export class ModifyReply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name:props.name, content:props.content};
    }
    onClose() {
        this.props.dialogHandler('x');
    }
    onSave() {
        var target = $(event.target);
        if (!target.hasClass("disable")){
            target.addClass("disable");
            if(!this.state.name) {
                $("#tag_dialog_bg .replyTitle").addClass("warning");
                target.removeClass("disable");
                return;
            }
            else{
                $("#tag_dialog_bg .replyTitle").removeClass("warning");
            }
            if (!this.state.content){
                $("#tag_dialog_bg .replyContent").addClass("warning");
                target.removeClass("disable");
                return;
            }
            else{
                $("#tag_dialog_bg .replyContent").removeClass("warning");
            }
            console.log("modify reply name:" + this.state.name+",content:"+this.state.content);
            this.props.eventHandler('a', this.state.name, this.state.content);
        }
    }

    getNameInputName(event) {
        this.state.name = event.target.value;
        this.forceUpdate();
    }
    getContentInputName(event) {
        this.state.content = event.target.value;
        this.forceUpdate();
    }

    handleInputKeyPress(event) {
        this.state.code = 0;
        this.state.message = "";
        this.forceUpdate();
        if(event.keyCode === 13) {
            this.onSave(event);
        }
    }

    componentDidMount(){
        var titleLen=$(".replyTitle").val().length;
        $(".frmcounterTitle .numtip").text(titleLen);
        var contentLen=$(".replyContent").val().length;
        $(".frmcounterContent .numtip").text(contentLen);

        $("#tag_dialog_bg .info .input").on("keyup keydown keypress",".replyTitle",function(){
            var len=$(this).val().length;
            if(len>20){
                var textCon=$(this).val().slice(0,20);
                $(this).val(textCon);
                return false;
            }else if(len==20){
                $(".frmcounterTitle .numtip,.frmcounterTitle .maxLength").addClass("hasMaxLength");
            }else{
                $(".frmcounterTitle .numtip,.frmcounterTitle .maxLength").removeClass("hasMaxLength");
            }
            $(".frmcounterTitle .numtip").text(len);
        })

        $("#tag_dialog_bg .info .input").on("keyup keydown keypress",".replyContent",function(){
            var len=$(this).val().length;
            if(len>200){
                var textCon=$(this).val().slice(0,200);
                $(this).val(textCon);
                return false;
            }else if(len==200){
                $(".frmcounterContent .numtip,.frmcounterContent .maxLength").addClass("hasMaxLength");
            }else{
                $(".frmcounterContent .numtip,.frmcounterContent .maxLength").removeClass("hasMaxLength");
            }
            $(".frmcounterContent .numtip").text(len);
        })
    }

    render() {
        return (
            <div id="tag_dialog_bg" style={{opacity:this.state.opacity}}>
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_quickReply_ModifyReply')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>
                    <form>
                        <ul className="info info6">
                            <li className="input">
                            <strong className="tagName tagName2 tagTitle">{Lang.str('app_setting_quickReply_Title')}</strong>
                            <input type="text"
                                   className="replyTitle"
                                   maxLength="20"
                                   value={this.state.name}
                                   onChange={this.getNameInputName.bind(this)}
                                   onKeyDown={this.handleInputKeyPress.bind(this)}/>
                                <i className="frmcounterTitle"><i className="numtip">0</i><i className="maxLength">/20</i></i>
                            </li>
                            <li className="input line2">
                            <strong className="tagName tagName2 lineHeight1">{Lang.str('app_setting_quickReply_Reply')}</strong>
                            <textarea
                                   className="replyContent borderDisplay"
                                   maxLength="200"
                                   value={this.state.content}
                                   onChange={this.getContentInputName.bind(this)}
                                   onKeyDown={this.handleInputKeyPress.bind(this)}/>
                                <i className="frmcounterContent"><i className="numtip">0</i><i className="maxLength">/200</i></i>
                            </li>
                        </ul>
                    </form>
                    <div className="btn-container btn-container6">
                        <button onClick={this.onSave.bind(this)}>{Lang.str('app_setting_quickReply_Save')}</button>
                        <button onClick={this.onClose.bind(this)}>{Lang.str('app_setting_quickReply_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}