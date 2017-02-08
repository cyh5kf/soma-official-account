import React from 'react'
import {ModifyEmail} from 'app/setting/personalInfomation/ModifyEmail'
import {ModifyPasswd} from 'app/setting/personalInfomation/ModifyPasswd'
import {ModifyName} from 'app/setting/personalInfomation/ModifyName'
import {ModifyId} from 'app/setting/personalInfomation/ModifyId'
import {PersonalInfoUtil} from 'app/setting/personalInfomation/PersonalInfoUtil'
import Session from 'app/Session'
import Lang from "lang/Lang"
import tools from 'utils/tools'
import {ImageThumbHelper} from 'utils/ImageThumbHelper'
import $ from 'jquery'

export class PersonalInfomation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {csAgent:{"email":"", "id":0, "name":"", "avatar":"https://s3.cn-north-1.amazonaws.com.cn/static-files/default-avatar1.jpg"}}
    }
    componentDidMount() {
        if (!Session.getLogined()) {
            return;
        }
        var csAgent = {}
        csAgent["aid"] = Session.getAid();
        csAgent["oid"] = Session.getOid();
        csAgent["email"] = Session.getEmail();
        csAgent["name"] = Session.getName();
        csAgent["avatar"] = Session.getAvatar();
        csAgent["csid"] = Session.getCsId();
        csAgent["role"] = Session.getRole();
        this.setState({csAgent: csAgent});
    }
    handleEmailDialog (evtype) {
        if('x' === evtype) {
            this.state.showEmailDialog = false;
        } else if('a' === evtype) {
            this.state.showEmailDialog = true;
        }
        this.setState({});
    }
    handlePasswdDialog (evtype) {
        if('x' === evtype) {
            this.state.showPasswdDialog = false;
        } else if('a' === evtype) {
            this.state.showPasswdDialog = true;
        }
        this.setState({});
    }
    handleNameDialog (evtype) {
        if('x' === evtype) {
            this.state.showNameDialog = false;
        } else if('a' === evtype) {
            this.state.showNameDialog = true;
        }
        this.setState({});
    }
    handleIdDialog (evtype) {
        if('x' === evtype) {
            this.state.showIdDialog = false;
        } else if('a' === evtype) {
            this.state.showIdDialog = true;
        }
        this.setState({});
    }

    handleEmailEvent(evtype, email) {
        console.log("evtype:"+evtype);
        var cbsuccess = function (cont, txtStatus, xhr) {
            if (200 === xhr.status) {
                console.log("modify email return ok, status:" + xhr.status + ", tag:" + (cont));
                this.state.csAgent.email = email;
                Session.setEmail(email);
                //alert(Lang.str('app_setting_personalInformation_ModifyEmailSuccessfully'))
                $.messageBox({message:Lang.str('app_setting_personalInformation_ModifyEmailSuccessfully'),level: "success"});
            } else {
                console.log("modify email return:" + cont + ", status:" + xhr.status);
            }
            this.state.showEmailDialog = false;
            this.setState({});
        }
        console.log("start modify email");
        PersonalInfoUtil.modifyEmailCall(email, cbsuccess.bind(this));
    }
    handlePasswdEvent(evtype, password, newpasswd) {
        console.log("evtype:"+evtype);
        var cbsuccess = function (cont, txtStatus, xhr) {
            console.log("modify password return ok, status:" + xhr.status + ", tag:" + (cont));
            if (200 === xhr.status) {
                //alert(Lang.str('app_setting_personalInformation_ModifyPasswordSuccessfully'))
                $.messageBox({message:Lang.str('app_setting_personalInformation_ModifyPasswordSuccessfully'),level: "success"});
                this.state.showPasswdDialog = false;
                this.setState({});
            } else if (207 === xhr.status) {
                if (cont.code == 2) {
                    //alert(Lang.str('app_setting_personalInformation_InvalidOldPassword'));
                    $.messageBox({message:Lang.str('app_setting_personalInformation_InvalidOldPassword'),level: "error"});
                }
                else {
                    //alert(xhr.responseJSON.message);
                    $.messageBox({message:xhr.responseJSON.message,level: "error"});
                }
            }
        }
        console.log("start modify password");
        PersonalInfoUtil.modifyPasswdCall(password, newpasswd, cbsuccess.bind(this));
    }
    handleNameEvent(evtype, name) {
        console.log("evtype:"+evtype);
        var cbsuccess = function (cont, txtStatus, xhr) {
            if (200 === xhr.status) {
                console.log("modify name return ok, status:" + xhr.status + ", tag:" + (cont));
                var tag = eval(cont);
                $.messageBox({message:Lang.str('app_setting_personalInformation_ModifyPasswordSuccessfully'),level: "success"});
                this.state.csAgent.name=name;
                Session.setName(name);
            } else {
                console.log("modify name return:" + cont + ", status:" + xhr.status);
            }
            this.state.showNameDialog = false;
            this.setState({});
        }
        console.log("start modify name");
        PersonalInfoUtil.modifyNameCall(name, cbsuccess.bind(this));
    }
    handleIdEvent(evtype, id) {
        console.log("evtype:"+evtype);
        var cbsuccess = function (cont, txtStatus, xhr) {
            if (200 === xhr.status) {
                console.log("modify id return ok, status:" + xhr.status + ", tag:" + (cont));
                var tag = eval(cont);
                this.state.csAgent.id = id;
            } else {
                console.log("modify id return:" + cont + ", status:" + xhr.status);
            }
            this.state.showIdDialog = false;
            this.setState({});
        }
        console.log("start modify id");
        PersonalInfoUtil.modifyCsidCall(id, cbsuccess.bind(this));
    }

    getInfo() {
        var cbsuccess = function(cont, txtStatus, xhr) {
            if(200 === xhr.status) {
                console.log("get personal info return ok, status:"+xhr.status);
                var jsonRet = eval(cont);
                for(var idx in jsonRet) {
                    var tag = jsonRet[idx];
                    console.log("get personal info,return tag["+idx+"]:"+JSON.stringify(tag));
                    this.state.tagList.pushTag(tag, false);
                }
                this.setState({});
            } else {
                console.log("get personal info return:"+JSON.stringify(cont)+", status:"+xhr.status);
            }
        }
        PersonalInfoUtil.getInfoCall(cbsuccess.bind(this));
    }
    updateAvatar(avatar) {
        console.log("new avatar:"+avatar);
        var cbsuccess = function (cont, txtStatus, xhr) {
            if (200 === xhr.status) {
                console.log("modify avatar return ok, status:" + xhr.status + ", tag:" + (cont));
                var tag = eval(cont);
                this.state.csAgent.avatar = avatar;
                Session.setAvatar(avatar);
                //更新sidebar上的头像
                this.props.forceUpdate();
            } else {
                console.log("modify avatar return:" + cont + ", status:" + xhr.status);
            }
            this.setState({});
        }
        console.log("start modify avatar");
        PersonalInfoUtil.modifyAvatarCall(avatar, cbsuccess.bind(this));
    }
    uploadAvatar(event) {
        let fileToLoad = event.target.files[0];
        console.log(">> uploadavatar:"+fileToLoad.toString())
        var fileSize = fileToLoad.size;
        var fileReader = new FileReader();
        var tag = this.state.tag;
        let that = this;
        fileReader.onload = function(fileLoadedEvent)
        {
            let content = fileLoadedEvent.target.result;
            var xhr = new XMLHttpRequest();
            var uploadStart = function(){
                console.log("uploadavatar Start");
                if(fileSize > 5242880){ //如果图片大于5M则弹窗提示
                    $.messageBox({message:Lang.str('app_setting_personalInformation_PhotoSizeErrorTip'),level: "error"});
                    $(".setting-avatar-info input").val("");
                    return false;
                }else {
                    var successfulCallBack = function(e){
                        console.log("uploadavatar end, status="+e.target.status)
                        if(e.target.status != 200){
                            //alert("Update Avatar Fail")
                            $.messageBox({message:Lang.str('app_setting_personalInformation_UploadAvatarFailed'),level: "error"});
                        }else {
                            $(".setting-avatar-info").removeClass("hidden");
                            $(".progressShow").addClass("hidden");
                            $(".loading").addClass("hidden");
                            $("#setting_avatar .passedProgress").css("width","0");
                            var resp = eval("(" + e.target.responseText + ")");
                            console.log(">> uploadavatar end, "+ e.target.responseText)
                            console.log(">> uploadavatar end, "+ resp["data"]["url"])
                            that.updateAvatar(resp["data"]["url"])
                        }
                    }
                    xhr.addEventListener("load", successfulCallBack, false); // 处理上传完成
                }
            }

            xhr.addEventListener("loadstart", uploadStart, false); // 处理上传开始



            var failCallBack = function(){
                console.log("failCallBack")
            }

            xhr.addEventListener("error", failCallBack, false); // 处理上传失败
            xhr.addEventListener("abort", failCallBack, false); // 处理取消上传
            var formData = new FormData();
            formData.append('file', fileToLoad);
            xhr.upload.onprogress = function(evt) {
                if(fileSize>5242880){
                    return false;
                } else {
                    var loaded = evt.loaded;
                    var tot = evt.total;
                    var per = Math.floor(100 * loaded / tot); //已经上传的百分比
                    $(".setting-avatar-info").addClass("hidden");
                    $(".progressShow").removeClass("hidden");
                    $(".loading").removeClass("hidden");
                    $("#setting_avatar .passedProgress").css("width",per+"%");
                    $("#setting_avatar .percentage").text(per+"%");
                }
            };
            xhr.open('post', '/upload/file5/upload/official.json?type=avatar');
            xhr.send(formData);
        };
        fileReader.readAsDataURL(fileToLoad);
    }

    render() {
        var addNewPage = "";
        var avatar = this.state.csAgent.avatar;
        if (avatar == null || avatar == "") {
            avatar = require("static/images/settings/default-avatar1.jpg");
        }
        else {
            avatar=ImageThumbHelper.getSquareThumbUrlByDefaultSize(avatar);
        }
        if(this.state.showEmailDialog) {
            addNewPage = <ModifyEmail
                email={this.state.csAgent.email}
                eventHandler = {this.handleEmailEvent.bind(this)}
                dialogHandler={this.handleEmailDialog.bind(this)} />;
        } else if (this.state.showPasswdDialog) {
            addNewPage = <ModifyPasswd
                eventHandler = {this.handlePasswdEvent.bind(this)}
                dialogHandler={this.handlePasswdDialog.bind(this)} />;
        } else if (this.state.showNameDialog) {
            addNewPage = <ModifyName
                name={this.state.csAgent.name}
                eventHandler = {this.handleNameEvent.bind(this)}
                dialogHandler={this.handleNameDialog.bind(this)} />;
        }
        return (
                <article id="setting_detail" className="content">
                <div className="contentHead">
                    <h3 className="title">{Lang.str('app_setting_personalInformation_AccountInformation')}</h3>
                    <p className="desc">{Lang.str('app_setting_personalInformation_AccountInformationDesc')}</p>
                </div>
                
                <section className="clearfix" id="setting_avatar">
                    <img className="setting-avatar fleft" src={avatar} />
                    <div className="progressShow hidden">
                        <span className="percentage"></span>
                        <div className="progressBar">
                            <div className="passedProgress"></div>
                        </div>
                        <div className="mask"></div>
                    </div>
                    <span className="loading hidden">Loading...</span>
                    <div className="setting-avatar-info fleft">
                        <label style={{color: '#007aff'}}>
                            <input className="hide"
                                   ref="uploadAvatar"
                                   type="file"
                                   accept="image/png,image/gif,image/jpg"
                                   onChange={this.uploadAvatar.bind(this)} />
                            <a class="btn-change-avatar">{Lang.str('app_setting_personalInformation_ChangeProfilePhoto')}</a>
                        </label>
                        <p>{Lang.str('app_setting_personalInformation_ChangeProfilePhotoDesc')}</p>
                    </div>
                </section>

                <div className="list">
                    <span>{Lang.str('app_setting_personalInformation_RegisteredEmail')}</span>
                    <label>{this.state.csAgent.email}</label>
                </div>

                <div className="list">
                    <span>{Lang.str('app_setting_personalInformation_Password')}</span>
                    <label style={{paddingTop: '4px',height: '28px'}}><input type="password" style={{border:'none',fontSize:'20px'}} value="******" disabled="disabled" /></label>
                    <a onClick={this.handlePasswdDialog.bind(this,'a')}>{Lang.str('app_setting_personalInformation_Modify')}</a>
                </div>

                <div className="list">
                    <span>{Lang.str('app_setting_personalInformation_Name')}</span>
                    <label>{this.state.csAgent.name}</label>
                    <a onClick={this.handleNameDialog.bind(this,'a')}>{Lang.str('app_setting_personalInformation_Modify')}</a>
                </div>

                <div className="list">
                    <span>{Lang.str('app_setting_personalInformation_Id')}</span>
                    <label>{this.state.csAgent.csid}</label>
                </div>
                <ul>{addNewPage}</ul>
            </article>
        );
    }
}

export default PersonalInfomation;
