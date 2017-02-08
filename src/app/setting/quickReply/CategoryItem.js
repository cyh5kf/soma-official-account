/**
 *
 * Created by jamin on 16/2/3.
 */
import React from 'react'
import {QuickReplyUtil} from 'app/setting/quickReply/QuickReplyUtil'
import {RenameCategory} from 'app/setting/quickReply/RenameCategory'
import {AddReply} from 'app/setting/quickReply/AddReply'
import {ModifyReply} from 'app/setting/quickReply/ModifyReply'
import Lang from "lang/Lang"

export class CsReplyItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name:props.name,content:props.content,tag:props.tag,reply_id:props.reply_id};
        this.state.activeClass="activeClass";
    }
    onDelete() {
        this.props.deleteEventHandler(this.props.reply_id);
    }
    handleModifyReplyEvent(evtype, name, content) {
        let self = this;
        console.log("handleModifyReplyEvent evtype:"+evtype);
        var cbsuccess = function (reply, txtStatus, xhr) {
            if (200 === xhr.status) {
                console.log("modify reply return ok, status:" + xhr.status + ", category:" + (reply));
                self.state.name = name;
                self.state.content = content;
                self.state.reply_id = self.props.reply_id;
                self.props.resetCategoryHundler(self.state);
            } else {
                console.log("modify reply return:" + cont + ", status:" + xhr.status);
            }
            this.state.activeClass="activeClass";
            this.state.showModifyReplyDialog = false;
            this.props.flushHandler();
            this.setState({});
        }
        console.log("start modify reply");
        QuickReplyUtil.modifyReplyCall(self.props.category_id, self.state.tag, name, content,
            self.state.reply_id, cbsuccess.bind(this));
    }
    handleModifyReplyCategoryDialog (evtype) {
        console.log(">> handleModifyReply");
        this.state.activeClass="activeClass";
        if('x' === evtype) {
            this.state.showModifyReplyDialog = false;
        } else if('a' === evtype) {
            this.state.showModifyReplyDialog = true;
        }
        this.setState({});
    }

    handleVisibleModify(){
        console.log(">>visibility");
        this.state.activeClass="";
        this.setState({});
    }

    handleHiddenModify(){
        this.state.activeClass="activeClass";
        this.setState({});
    }

    render() {
        var addNewPage = "";
        if(this.state.showModifyReplyDialog) {
            addNewPage = <ModifyReply
                name={this.props.name}
                content={this.props.content}
                eventHandler={this.handleModifyReplyEvent.bind(this)}
                dialogHandler={this.handleModifyReplyCategoryDialog.bind(this)}/>;
        }
        return (
            <tr onMouseOver={this.handleVisibleModify.bind(this)} onMouseOut={this.handleHiddenModify.bind(this)}>
                <td className="addReply-list addReply-list-name" title={this.props.name}>{this.props.name}</td>
                <td className="addReply-list addReply-list-content">{this.props.content}</td>

                <td className="addReply-list-handle">
                    <span className={'edit_icon '+this.state.activeClass} onClick={this.handleModifyReplyCategoryDialog.bind(this, 'a')}></span>
                    <span className={'del_icon '+this.state.activeClass} onClick={this.onDelete.bind(this)}></span>
                </td>
                <td>
                {addNewPage}
                </td>
            </tr>
        );
    }
}

export class CategoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: props.name, tag:props.tag, category_id:props.category_id};
        this.state.imageClass="open-img";
        this.state.showReplys=true;
    }


    handleDeleteReplyEvent(reply_id) {
        console.log(">> handleDeleteReplyEvent evtype:"+",reply_id:"+reply_id);
        var cbsuccess = function (category, txtStatus, xhr) {
            if (200 === xhr.status) {
                console.log("delete reply return ok, status:" + xhr.status + ", category:" + (category));
                this.props.removeCategoryReplyHundler(this.props.category_id,reply_id);
            } else {
                console.log("delete reply return:" + cont + ", status:" + xhr.status);
            }
        }
        console.log("delete reply");
        QuickReplyUtil.deleteReplyCall(this.props.tag, reply_id,cbsuccess.bind(this));
    }
    handleRenameCategoryEvent(evtype, newname) {
        console.log("evtype:"+evtype);
        var cbsuccess = function (category, txtStatus, xhr) {
            if (200 === xhr.status) {
                console.log("add new category return ok, status:" + xhr.status + ", category:" + (category));
                this.state.name = newname;
                this.props.changeParentCategoryHundler(this.props.category_id,newname);
            } else {
                console.log("add new category return:" + cont + ", status:" + xhr.status);
            }
            this.state.showRenameCategoryDialog = false;
            this.flush();
        }
        console.log("start new category");
        QuickReplyUtil.renameCategoryCall(this.props.category_id, this.props.tag, newname,cbsuccess.bind(this));
    }
    handleAddReplyEvent(evtype, name, content) {
        console.log("evtype:"+evtype);
        var cbsuccess = function (reply, txtStatus, xhr) {
            if (200 === xhr.status) {
                console.log("add reply return ok, status:" + xhr.status + ", category:" + (reply));
                this.props.replys.push(reply);
                this.state.showReplys = true;
            } else {
                console.log("add reply return:" + cont + ", status:" + xhr.status);
            }
            this.state.showAddreplyCategoryDialog = false;
            this.flush();
        }
        console.log("start add reply");
        QuickReplyUtil.addReplyCall(this.props.category_id, this.props.tag, name, content, cbsuccess.bind(this));
    }
    handleAddReplyCategoryDialog(evtype) {
        console.log(">> handleAddReplyCategory");
        if('x' === evtype) {
            this.state.showAddreplyCategoryDialog = false;
        } else if('a' === evtype) {
            this.state.showAddreplyCategoryDialog = true;
        }
        this.setState({});
        return false;
    }

    componentDidMount() {

    }

    handleShowReplys (evtype,clsName) {
        console.log(">> handleShowReply :"+this.state.showReplys);
        if (clsName==='empty-img'){
            return false;
        }
        this.state.showReplys = !this.state.showReplys;
        if (this.state.showReplys) {
            this.state.imageClass="open-img";
        }else{
            this.state.imageClass="close-img";
        }
        this.setState({});
    }
    handleRenameCategoryDialog (evtype, tag) {
        console.log(">> handleRenameCategory");
        if('x' === evtype) {
            this.state.showRenameCategoryDialog = false;
        } else if('a' === evtype) {
            this.state.showRenameCategoryDialog = true;
        }
        this.setState({});
        return false;
    }

    resetCategoryItem(obj){
        var csCategory = this.props.replys;
        for (var i = 0;i<csCategory.length;i++){
            if (obj.reply_id===csCategory[i].reply_id){
                csCategory[i].name = obj.name;
                csCategory[i].content = obj.content;
                return;
            }
        }
    }

    flush(){
        this.props.flushHandler();
        this.setState({});
    }
    
    deleteCategory() {
        this.props.deleteEventHandler(this.props.tag, this.props.category_id);
    }

    render() {
        var addNewPage = "";
        if(this.state.showAddreplyCategoryDialog) {
            addNewPage = <AddReply
                tag = {this.state.tag}
                eventHandler={this.handleAddReplyEvent.bind(this)}
                dialogHandler={this.handleAddReplyCategoryDialog.bind(this)}/>;
        } else if (this.state.showRenameCategoryDialog) {
            addNewPage = <RenameCategory
                tag={this.state.tag}
                name={this.props.name}
                eventHandler={this.handleRenameCategoryEvent.bind(this)}
                dialogHandler={this.handleRenameCategoryDialog.bind(this)}/>;
        }
        var replys = this.props.replys;
        var replyitems = [];
        if (this.state.showReplys) {
            if (!replys||replys.length==0) {
                console.log(">>length==0")
                this.state.imageClass = 'empty-img';
                replyitems.push(
                    <tr>
                        <td className="group-empty"><f>{Lang.str('app_setting_quickReply_CategoryEmpty')}</f><span className="btn-delete" onClick={this.deleteCategory.bind(this)}>{Lang.str('app_setting_quickReply_Delete')}</span></td>
                    </tr>
                );
            }else{
                this.state.imageClass = 'open-img';
                for (var idx in replys) {
                    console.log("replyesssss",replys[idx])
                    let key = "reply_"+replys[idx].reply_id;
                    console.log("key",key)
                    replyitems.push(<CsReplyItem key={key}
                        flushHandler={this.flush.bind(this)}
                        tag={this.state.tag}
                        reply_id={replys[idx].reply_id}
                        name={replys[idx].name}
                        content={replys[idx].content}
                        category_id={this.props.category_id}
                        resetCategoryHundler={this.resetCategoryItem.bind(this)}
                        deleteEventHandler={this.handleDeleteReplyEvent.bind(this)}
                    />);
                }               
            }

        }


        return (
            <div className="custom-list">

                <div className= {'rootCategory '+this.state.imageClass} onClick={this.handleShowReplys.bind(this,event,this.state.imageClass)}>
                    <span className="categoryName">{this.props.name}</span>
                    <span className="AddReply" onClick={this.handleAddReplyCategoryDialog.bind(this,'a')}></span>
                    <span className="Rename" onClick={this.handleRenameCategoryDialog.bind(this,'a')}></span>
                </div>

                <ul>{addNewPage}</ul>
                <table className="">
                    <tbody>
                    {replyitems}
                    </tbody>
                </table>
            </div>
        )
    }
}