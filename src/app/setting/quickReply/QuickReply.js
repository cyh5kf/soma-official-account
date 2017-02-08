import React from 'react'
import {NewCategory} from 'app/setting/quickReply/NewCategory'
import {QuickReplyUtil} from 'app/setting/quickReply/QuickReplyUtil'
import {RenameCategory} from 'app/setting/quickReply/RenameCategory'
import {AddReply} from 'app/setting/quickReply/AddReply'
import {CategoryItem} from 'app/setting/quickReply/CategoryItem'
import {ImportTemplate} from 'app/setting/quickReply/ImportTemplate'
import tools from 'utils/tools'
import Session from 'app/Session'
import Lang from "lang/Lang"
import $ from 'jquery'


export class QuickReply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tag:"enterp", role:Session.getRole()};
        this.state.csCategory = []
        this.state.csCategory["enterp"] = [];
        this.state.csCategory["agent"] = [];
        this.state.head_tag_e="enterprise qrh-active";
        this.state.head_tag_my="my";
        if (this.state.role==='0'){
            this.state.tag = "agent";
            this.state.head_tag_e="enterprise";
            this.state.head_tag_my="my qrh-active";
        }
        this.state.showImportDialog = false;
    }


    handleNewCategoryEvent(evtype, name) {
        console.log("evtype:"+evtype);
        var cbsuccess = function (category, txtStatus, xhr) {
            if (200 == xhr.status) {
                console.log("add new category return ok, status:" + xhr.status + ", category:" + (category));
                category.content=[];
                this.state.csCategory[this.state.tag].push(category)
            } else {
                console.log("add new category return:" + cont + ", status:" + xhr.status);
            }
            this.state.showNewCategoryDialog = false;
            this.setState({});
        }
        console.log("start new category, name:"+name+",tag:"+this.state.name);
        QuickReplyUtil.newCategoryCall(name, this.state.tag, cbsuccess.bind(this));
    }
    handleNewCategoryDialog (evtype) {
        if('x' === evtype) {
            this.state.showNewCategoryDialog = false;
        } else if('a' === evtype) {
            this.state.showNewCategoryDialog = true;
        }
        this.setState({});
    }

    handleImportDialog (evtype) {
        console.log(">> import template:"+evtype)
        if('x' === evtype) {
            this.state.showImportDialog = false;
        } else if('a' === evtype) {
            this.state.showImportDialog = true;
        }
        this.setState({});
    }

    flush(){
        console.log(">> flush")
        this.setState({});
    }
    useEnterprise() {
        var cbsuccess = function (ret, txtStatus, xhr) {
            var t_e = this.state.csCategory['enterp']
            var t_m = this.state.csCategory['agent']
            this.state.csCategory['enterp'] = []
            this.state.csCategory['agent'] = []
            this.flush()

            this.state.tag = "enterp";
            this.state.head_tag_e="enterprise qrh-active";
            this.state.head_tag_my="my";
            console.log(">>use enterprise template, tag:"+this.state.tag)

            this.state.csCategory['enterp'] = t_e
            this.state.csCategory['agent'] = t_m
            this.flush()
        }
        QuickReplyUtil.idleCall(cbsuccess.bind(this));
    }
    userMy() {
        var cbsuccess = function (ret, txtStatus, xhr) {
            var t_e = this.state.csCategory['enterp']
            var t_m = this.state.csCategory['agent']
            this.state.csCategory['enterp'] = []
            this.state.csCategory['agent'] = []
            this.flush()

            console.log(">> user my")
            this.state.tag = "agent";
            this.state.head_tag_e="enterprise";
            this.state.head_tag_my = "my qrh-active";
            console.log(">>use my template, tag:"+this.state.tag)

            this.state.csCategory['enterp'] = t_e
            this.state.csCategory['agent'] = t_m
            this.flush()
        }
        QuickReplyUtil.idleCall(cbsuccess.bind(this));
    }
    removeCategory(category_id) {
        var tag = this.state.tag;
        var csCategory = this.state.csCategory[tag];
        for(var i=0;i<csCategory.length;i++) {
            var ca = csCategory[i]
            if(category_id === ca.category_id) {
                csCategory.splice(i,1);
                break;
            }
        }
        this.forceUpdate();
    }

    removeCategoryReply(category_id,reply_id) {
        var tag = this.state.tag;
        console.log("before", this.state.csCategory[tag])
        var csCategory = this.state.csCategory[tag];
        for(var i=0;i<csCategory.length;i++) {
            var ca = csCategory[i];
            if(category_id === ca.category_id) {
                for(var j = 0;j<ca.content.length;j++){
                    if (reply_id===ca.content[j].reply_id){
                        ca.content.splice(j,1);
                        break;
                    }
                }
                break;
            }
        }
        this.forceUpdate();
    }

    deleteCategory(tag, category_id) {
        console.log("deleteCategory:"+category_id+",tag:"+tag);
        var cbsuccess = function (category, txtStatus, xhr) {
            if (200 == xhr.status) {
                console.log("delete category return ok, status:" + xhr.status + ", category:" + (category));
                this.removeCategory(category_id);
            } else {
                console.log("delete category return:" + cont + ", status:" + xhr.status);
            }
        }
        console.log("delete category");
        QuickReplyUtil.deleteCategoryCall(tag, category_id, cbsuccess.bind(this));
    }
    sendFile(file) {
        console.log(">> endFile:"+file.toString())
        var fileReader = new FileReader();
        var tag = this.state.tag;
        let that = this;
        fileReader.onload = function(fileLoadedEvent)
        {
            let content = fileLoadedEvent.target.result;
            var xhr = new XMLHttpRequest();
            var uploadStart = function(){
                console.log("uploadStart");
            }

            xhr.addEventListener("loadstart", uploadStart, false); // 处理上传完成
            var successfulCallBack = function(e){
                console.log("load end, statue="+e.target.status)
                if(e.target.status != 200){
                    $.messageBox({message:Lang.str("app_setting_quickReply_errorFileFormat"),level: "error"});
                }else {
                    console.log(">> sendFile end, "+ e.target.responseText)
                    var resp = JSON.parse(e.target.responseText);
                    if(resp&&resp.length>0){
                        $.messageBox({message:Lang.str("app_setting_quickReply_uploadSuccess"),level: "success"});
                        that.state.csCategory[that.state.tag].push.apply(that.state.csCategory[that.state.tag],resp);
                    }
                    else{
                        $.messageBox({message:Lang.str("app_setting_quickReply_errorFileFormat"),level: "error"});
                    }
                    that.setState({});
                }
            }
            xhr.addEventListener("load", successfulCallBack, false); // 处理上传完成

            var failCallBack = function(){
                console.log("failCallBack")
            }

            xhr.addEventListener("error", failCallBack, false); // 处理上传失败
            xhr.addEventListener("abort", failCallBack, false); // 处理取消上传
            var formData = new FormData();
            formData.append('file', file);
            xhr.open('post', '/api/v1/cs/quickreply/'+tag+'import');
            console.log(">> send file")
            xhr.send(formData);
            console.log(">> send over")
        };
        fileReader.readAsDataURL(file);
    }
    initCsCategory() {
        var initcb = function (category, txtStatus, xhr) {
            if (xhr.status == 200) {
                this.state.csCategory["enterp"] = category["enterp"];
                this.state.csCategory["agent"] = category["agent"];
                console.log(">> initCsCategory: "+xhr.responseText);
                this.flush();
            }
        };
        QuickReplyUtil.getAllQuickList(initcb.bind(this));
    }

    componentDidMount() {
        this.initCsCategory();
    }

    resetCategoryNameById(category_id,newName){
        var categoryList = this.state.csCategory[this.state.tag];
        for (var i=0;i<categoryList.length;i++) {
            var category = categoryList[i];
            if (category.category_id===category_id){
                category.name = newName;
                break;
            }
        }
    }

    downloadEmptyTemp(){
        window.location='https://d51wm8y7a2ot9.cloudfront.net/official-account/res/setting_quickReplay.xls';
    }

    render() {
        var addNewPage = null;
        if(this.state.showNewCategoryDialog) {
            addNewPage = <NewCategory
                tag = {this.state.tag}
                eventHandler={this.handleNewCategoryEvent.bind(this)}
                dialogHandler={this.handleNewCategoryDialog.bind(this)}/>;
        } else if(this.state.showImportDialog) {
            console.log(">> showImportDialog")
            addNewPage = <ImportTemplate
                tag = {this.state.tag}
                sendFileHandler = {this.sendFile.bind(this)}
                dialogHandler={this.handleImportDialog.bind(this)}/>;
        }

        var csCategory =this.state.csCategory[this.state.tag];
        var csCategoryItems = [];
        console.log("push",csCategory);
        for (var idx in csCategory) {
            console.log("reply",csCategory[idx].content);
            var key = "quick_"+csCategory[idx].category_id;
            csCategoryItems.push(<CategoryItem
                                key={key}
                                changeParentCategoryHundler = {this.resetCategoryNameById.bind(this)}
                                flushHandler={this.flush.bind(this)}
                                deleteEventHandler={this.deleteCategory.bind(this)}
                                removeCategoryReplyHundler = {this.removeCategoryReply.bind(this)}
                                category_id={csCategory[idx].category_id}
                                name={csCategory[idx].name}
                                replys={csCategory[idx].content}
                                tag={this.state.tag}
                                />);
        }
        var t_enterprise = null;
        if (this.state.role != "0") {
            t_enterprise =
                <a className={this.state.head_tag_e} onClick={this.useEnterprise.bind(this)}>{Lang.str('app_setting_quickReply_EnterpriseTemplates')}</a>
        }
        var t_export =
            <a className="export" href={"/api/v1/cs/quickreply/"+this.state.tag+"export"}></a>;

        return (
            <article className="quick-reply-settings">
                <div className="quick-reply-head">
                    <h3>{Lang.str('app_setting_quickReply_QuickReplyList')}</h3>
                    <span className="downloadTemps" onClick={this.downloadEmptyTemp.bind(this)}>{Lang.str('app_setting_quickReply_DownloadTemplates')} <span className="template_name">{Lang.str("app_setting_quickReply_Templates")}</span></span>
                    <p className="tip">{Lang.str('app_setting_quickReply_QuickReplyListDesc')}</p>
                </div>

                <div className="quick-reply-list">
                    {t_enterprise}
                    <a className={this.state.head_tag_my} onClick={this.userMy.bind(this)}>{Lang.str('app_setting_quickReply_MyTemplates')}</a>
                    {t_export}
                    <a className="import" onClick={this.handleImportDialog.bind(this, 'a')}></a>
                    <div><div className="btn btn-blue" onClick={this.handleNewCategoryDialog.bind(this, 'a')}>{Lang.str('app_setting_quickReply_NewCategory')}</div></div>
                    {csCategoryItems}
                </div>
                <ul>{addNewPage}</ul>
            </article>
        );
    }
}

export default QuickReply;