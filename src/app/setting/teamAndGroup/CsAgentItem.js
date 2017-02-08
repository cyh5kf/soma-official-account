import React from 'react'
import {ImageThumbHelper} from 'utils/ImageThumbHelper'
import TeamAndGroupApiUtil from 'app/setting/teamAndGroup/TeamAndGroupApiUtil'
import $ from 'jquery'
import Lang from "lang/Lang"

export class CsAgentItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {deleteState: false};
    }

    handleModifyCustomer() {
        this.props.onModifyCustomer(this.props.csAgent.aid);
        return false;
    }


    handleDeleteComfirm(event){
        var csAgent = this.props.csAgent;
        this.props.onDeleteDialog(csAgent);
        return false;
    }

    componentDidMount() {
        $(".groupExamples .grEx-content ul li").mouseover(function(){
            $(this).find(".modifyService").removeClass("hidden");
            $(this).find(".deleteService").removeClass("hidden");
        }).mouseleave(function(){
            $(this).find(".modifyService").addClass("hidden");
            $(this).find(".deleteService").addClass("hidden");
        })
    }

    render() {
        var role = this.props.csAgent.role;
        var roleClass="";
        var modifyAndDeleteDom = "";
        if(role==9){
            roleClass="superManage";
            modifyAndDeleteDom = <div>
                <span className="modifyService modifyPosition hidden" onClick={this.handleModifyCustomer.bind(this)}></span>
            </div>
        }else if(role==1){
            roleClass="normalManage"
            modifyAndDeleteDom = <div>
                <span className="modifyService modifyPosition hidden"></span>
            </div>
        } else {
            modifyAndDeleteDom = <div>
                <span className="modifyService hidden"></span>
                <span className="deleteService hidden" onClick={this.handleDeleteComfirm.bind(this)}></span>
            </div>
        }

        var avatar = this.props.csAgent.avatar;
        if (avatar == null || avatar == "") {
            avatar = require("static/images/settings/default-avatar1.jpg");
        }
        else {
            avatar=ImageThumbHelper.getSquareThumbUrlByDefaultSize(avatar);
        }

        var csid = this.props.csAgent.csid;
        var csidDom = null;
        if(csid) {
            csidDom = <span className="idName">{"ID" +" " + csid}</span>
        }


        return(
            <li onClick={this.handleModifyCustomer.bind(this)}>
                <img src={avatar} alt="portrait"/>
                <span className={roleClass}></span>
                <span className="r_desc">
                    <span>{this.props.csAgent.name}</span>
                    <span className="mail">{this.props.csAgent.email}</span>
                    {csidDom}
                </span>
                {modifyAndDeleteDom}
            </li>
        )
    }
}

export default CsAgentItem;