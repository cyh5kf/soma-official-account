import React from 'react'
import tools from 'utils/tools'
import ReplyMsgTextArea from 'app/setting/systemAutoReply/ReplyMsgTextArea'
import SystemAutoReplyApiUtil from 'app/setting/systemAutoReply/SystemAutoReplyApiUtil'
import Lang from "lang/Lang"
import $ from 'jquery'

export class SystemAutoReply extends React.Component {

    constructor(props) {
        super(props);
        this.state = {csSetting: {
            welcome_msg_on: 0,
            welcomemsg: '',
            no_response_msg_on: 1,
            no_response_msg: '',
            no_response_duration: 20,
            none_working_msg_on: 1,
            none_working_msg: '',
            end_conv_msg_on: 1,
            manual_end_conv_msg: '',
            auto_end_conv_msg: ''
        }};
    }

    componentDidMount() {
        var initcb = function (csSetting, txtStatus, xhr) {
            if (xhr.status == 200) {
                this.setState({csSetting: csSetting});
                //选中状态下显示深色背景
                var fieldOnOffs = ['welcome_msg_on', 'no_response_msg_on', 'none_working_msg_on', 'end_conv_msg_on'];
                for (var idx in fieldOnOffs) {
                    var checked_state = document.getElementById(fieldOnOffs[idx]);
                    var isChecked = $(checked_state).hasClass("checked");
                    if (isChecked) {
                        var selected_bdcolor = document.getElementById(fieldOnOffs[idx]).parentNode.parentNode;
                        $(selected_bdcolor).addClass("selected_bdcolor");
                    }
                }
                this.forceUpdate();
            }
        };
        SystemAutoReplyApiUtil.getInitialSetting(initcb.bind(this));

    }

    handleSaveSuccess(field, content) {
        console.log("handleSaveSuccess",field, content);
        this.state.csSetting[field] = content;
        this.forceUpdate();
    }

    handleOnOff(event) {
        var eventid = event.target.id;
        var checked = event.target.checked;
        var successcb = function (data, txtStatus, xhr) {
            if (xhr.status == 200) {
                this.state.csSetting[eventid] = checked;
                var setting_wrap = document.getElementById(eventid).parentNode.parentNode;
                if(checked){
                    $(setting_wrap).addClass("selected_bdcolor");
                } else {
                    $(setting_wrap).removeClass("selected_bdcolor");
                }
                this.forceUpdate();
            }
        };
        SystemAutoReplyApiUtil.updateOnOff(eventid, checked, successcb.bind(this));
        $.messageBox({"message":Lang.str('app_setting_systemAutoReply_ChangeSaved'),"level":"success"});
    }

    handleDuration(event) {
        var self = this;
        var duration = event.target.value;
        var successcb = function (data, txtStatus, xhr) {
            if (xhr.status == 200) {
                this.state.csSetting['no_response_duration'] = duration;
                this.forceUpdate();
            }
        };
        SystemAutoReplyApiUtil.updateNoResponseDuration(duration, successcb.bind(this));
    }

    handleFocus(e){
        var curTarget = $(e.currentTarget);
        curTarget.attr("data-num",curTarget.val());
    }

    handleBlured(e){
        var curTarget = $(e.currentTarget);
        if (curTarget.attr("data-num")!==curTarget.val()){
            $.messageBox({"message":Lang.str('app_setting_systemAutoReply_ChangeSaved'),"level":"success"});
        }
    }

    render() {
        var fieldOnOffs = ['welcome_msg_on', 'no_response_msg_on', 'none_working_msg_on', 'end_conv_msg_on'];

        // checkbox
        var checkboxDoms = {};
        for (var idx in fieldOnOffs) {
            var checked_state = this.state.csSetting[fieldOnOffs[idx]];
            checkboxDoms[fieldOnOffs[idx]] = <input id={fieldOnOffs[idx]} type="checkbox" className={checked_state?"checked":''} checked={this.state.csSetting[fieldOnOffs[idx]]} onChange={this.handleOnOff.bind(this)} />;
        }
        return (
            <article id="setting_detail" className="content">
                <div className="setting_wrap">
                    <label className="chb fontBold">
                        {checkboxDoms['welcome_msg_on']}
                        {Lang.str('app_setting_systemAutoReply_EnterpriseWelcomeMessage')}
                    </label>
                    <p className="des">{Lang.str('app_setting_systemAutoReply_EnterpriseWelcomeMessageDesc')}</p>
                    <ReplyMsgTextArea field="welcomemsg" content={this.state.csSetting['welcomemsg']} afterSaveSuccess={this.handleSaveSuccess.bind(this)}/>
                </div>

                <div className="setting_wrap">
                    <label className="chb fontBold">
                        {checkboxDoms['no_response_msg_on']}
                        {Lang.str('app_setting_systemAutoReply_InactiveCustomerServiceMessage')}
                    </label>
                    <p className="des">{Lang.str('app_setting_systemAutoReply_InactiveCustomerServiceMessageDesc')}</p>
                    <ReplyMsgTextArea field="no_response_msg" content={this.state.csSetting['no_response_msg']} afterSaveSuccess={this.handleSaveSuccess.bind(this)}/>
                </div>


                <div className="setting_wrap">
                    <label className="chb fontBold">
                        {checkboxDoms['none_working_msg_on']}
                        {Lang.str('app_setting_systemAutoReply_NoneOfCustomerServiceOnlineMessage')}
                    </label>
                    <p className="des">{Lang.str('app_setting_systemAutoReply_NoneOfCustomerServiceOnlineMessageDesc')}</p>
                    <ReplyMsgTextArea field="none_working_msg" content={this.state.csSetting['none_working_msg']} afterSaveSuccess={this.handleSaveSuccess.bind(this)}/>
                </div>

                <div className="setting_wrap">
                    <label className="chb fontBold">
                        {checkboxDoms['end_conv_msg_on']}
                        {Lang.str('app_setting_systemAutoReply_EndConversationMessage')}
                    </label>
                    <p className="des">
                        {Lang.str('app_setting_systemAutoReply_EndConversationMessageDesc')}
                    </p>
                    <span className="subtitle">{Lang.str('app_setting_systemAutoReply_CustomerServiceEndsConversation')}</span>
                    <ReplyMsgTextArea field="manual_end_conv_msg" content={this.state.csSetting['manual_end_conv_msg']} afterSaveSuccess={this.handleSaveSuccess.bind(this)}/>
                    <span className="subtitle">{Lang.str('app_setting_systemAutoReply_SystemEndsConversation')}</span>
                    <ReplyMsgTextArea field="auto_end_conv_msg" content={this.state.csSetting['auto_end_conv_msg']} afterSaveSuccess={this.handleSaveSuccess.bind(this)}/>
                </div>
            </article>
        );
    }
}

export default SystemAutoReply;