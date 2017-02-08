import React from 'react'
import {UserTagUtil} from 'app/setting/userTag/UserTagUtil'
import {UserTagList} from 'app/setting/userTag/UserTagList'
import {TagColorCenter} from 'utils/TagColorCenter'
import {AddUserTag} from 'app/setting/userTag/AddUserTag'
import Lang from "lang/Lang"

class UserTagItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onModify() {
        this.props.dialogHandler('m', this.props.tag);
    }

    onDelete() {
        var tag = this.props.tag;
        //this.props.eventHandler('d', tag.tag_id, '-', tag.color);
        this.props.delDialogHandler(1,tag);
    }

    render() {
        var tag = this.props.tag;
        var jcolor = TagColorCenter.getColorById(tag.color);
        var color="tag-"+jcolor.color;
        return (
            <tr>
                <td>
                    <label className={color}>{tag.name}</label>
                </td>
                <td>{tag.usage}</td>
                <td>
                    <a href="#" onClick={this.onModify.bind(this)}>{Lang.str('app_setting_userTag_Modify')}&nbsp;</a>
                    <a href="#" onClick={this.onDelete.bind(this)}>&nbsp;{Lang.str('app_setting_userTag_Delete')}</a>
                </td>
            </tr>
        )
    }
}

export class UserTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tagList : new UserTagList(this.handleTagEvent.bind(this))};
        this.getTagList();
    }
    getTagList() {
        var cbsuccess = function(cont, txtStatus, xhr) {
            if(200 === xhr.status) {
                console.log("getTagList return ok, status:"+xhr.status);
                var jsonRet = eval(cont);
                for(var idx in jsonRet) {
                    var tag = jsonRet[idx];
                    console.log("getTagList return tag["+idx+"]:"+JSON.stringify(tag));
                    this.state.tagList.pushTag(tag, false);
                }
                this.setState({});
            } else {
                console.log("getTagList return:"+JSON.stringify(cont)+", status:"+xhr.status);
            }
        }
        UserTagUtil.getTagListCall(cbsuccess.bind(this));
    }

    onModifyTag() {
        this.state.showAddDialog = true;
        this.setState({});
    }

    handleAddDialog (evtype, tag) {
        if('x' === evtype) {
            this.state.showAddDialog = false;
        } else if('a' === evtype) {
            this.state.tagModify = null;
            this.state.showAddDialog = true;
        } else if('m' === evtype) {
            this.state.tagModify = tag;
            this.state.showAddDialog = true;
        }
        this.setState({});
    }

    handleDelDialog (flag,tag){
        this.state.tag = tag;
        this.state.showDelDialog = flag===1;
        this.setState({});
    }
    handleTagEvent(evtype, tagid, tagname, tagcolor) {
        //console.log("evtype:"+evtype);
        // do modify/delete/add
        if('m' === evtype) {
            var cbsuccess = function (cont, txtStatus, xhr) {
                if (200 === xhr.status) {
                    console.log("modifyTag return ok, status:" + xhr.status);
                    var tag = this.state.tagList.getTagById(tagid);
                    if (tag !== null) {
                        tag.name = tagname;
                        tag.color = tagcolor;
                    }
                    this.state.showAddDialog = false;
                    this.setState({});
                } else {
                    console.log("modifyTag return:" + JSON.stringify(cont) + ", status:" + xhr.status);
                }
            }
            UserTagUtil.modifyTagCall(tagid, tagname, tagcolor, cbsuccess.bind(this));
        } else if('d' === evtype) {
            var cbsuccess = function(cont, txtStatus, xhr) {
                if(200 === xhr.status) {
                    console.log("deleteTag return ok, status:"+xhr.status);
                    this.state.tagList.removeTag(tagid);
                    this.state.showDelDialog = 0;
                    this.setState({});
                } else {
                    console.log("deleteTag return:"+JSON.stringify(cont)+", status:"+xhr.status);
                }
            }
            UserTagUtil.deleteTagCall(tagid, cbsuccess.bind(this));
        } else if('a' == evtype) {
            var cbsuccess = function (cont, txtStatus, xhr) {
                if (200 === xhr.status) {
                    console.log("addTag return ok, status:" + xhr.status + ", tag:" + JSON.stringify(cont));
                    var tag = eval(cont);
                    this.state.tagList.pushTag(tag, true);
                    this.state.showAddDialog = false;
                    this.setState({});
                } else {
                    console.log("addTag return:" + JSON.stringify(cont) + ", status:" + xhr.status);
                }
            }
            UserTagUtil.addTagCall(tagname, tagcolor, cbsuccess.bind(this));
        } else if('u' === evtype) {
            this.setState({});
        } else {
            console.log("BUG: unknown event type:"+evtype);
        }
    }

    render() {
        var tagItems = [];
        var tagList = this.state.tagList;
        for(var idx in tagList.getTagList()) {
            var tag = tagList.getTagByIndex(idx);
            tagItems.push(<UserTagItem
                tag = {tag}
                eventHandler={this.handleTagEvent.bind(this)}
                dialogHandler={this.handleAddDialog.bind(this)}
                delDialogHandler={this.handleDelDialog.bind(this)} />);
                //console.log("render tag["+idx+"]:"+JSON.stringify(tag));
        }
        var addNewPage = null,deleteDialog=null;
        if(this.state.showAddDialog) {
            addNewPage = <AddUserTag
                tag = {this.state.tagModify}
                eventHandler = {this.handleTagEvent.bind(this)}
                dialogHandler={this.handleAddDialog.bind(this)} />;
        }
        if (this.state.showDelDialog){
            deleteDialog = <div className="addEditorDialogBg setEditorDelete jsdeleteDialog" >
                <div className="addEditorDialog">
                    <header><h3>{Lang.str("app_setting_SetEditorTeam_SettingDelete")}</h3><a className="close" onClick={this.handleDelDialog.bind(this,0)}></a></header>
                    <p className="lineDivision">{Lang.str('app_setting_userTag_Delete_alert')}</p>
                    <div className="btn-container">
                        <button className="jssave" onClick={this.handleTagEvent.bind(this,'d', this.state.tag.tag_id, '-', this.state.tag.color)}>{Lang.str("app_article_confirm")}</button>
                        <button className="jscancel" onClick={this.handleDelDialog.bind(this,0)}>{Lang.str("app_article_cancel")}</button>
                    </div>
                </div>
            </div>
        }
        return (
            <article id="setting_detail" className="content">
                <div className="userTagTitle">
                    <h3 className="title">{Lang.str('app_setting_userTag_UserTag')}</h3>
                    <p className="desc">{Lang.str('app_setting_userTag_UserTagDesc')}</p>
                </div>
                <button className="btn btn-blue" id="btn_new" ref="btn_new"
                        onClick={this.handleAddDialog.bind(this, 'a')}>{Lang.str('app_setting_userTag_NewUserTag')}</button>
                <table className="data-list">
                    <thead>
                    <tr>
                        <td>{Lang.str('app_setting_userTag_Tag')}</td>
                        <td>{Lang.str('app_setting_userTag_UsageCount')}</td>
                        <td>{Lang.str('app_setting_userTag_Operation')}</td>
                    </tr>
                    </thead>
                    <tbody>
                    {tagItems}
                    </tbody>
                </table>
                <ul>{addNewPage}</ul>
                {deleteDialog}
            </article>
        );
    }
}

export default UserTag;
