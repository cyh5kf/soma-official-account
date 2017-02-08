import $ from "jquery";
import MessageStore from "app/chat/stores/MessageStore";
import log from "loglevel"
import ConversationStore from "app/chat/stores/ConversationStore";


export class  ChatWebAPIUtils{
  static getAllConversations(successHandler,url){
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: successHandler
    });
  }

  static sendMessage(sendingMessage,successCallBack,failCallBack){
    $.ajax({
      url: '/api/v1/cs/message/sendmessage',
      type: 'POST',
      data: JSON.stringify(sendingMessage),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: successCallBack,
      error:failCallBack
    });
  }

  static getConversation(uid,conv_id,successCallBack){
    $.ajax({
      url: '/api/v1/cs/conversation/getsingleconv?uid='+uid+"&convid="+conv_id,
      type: 'GET',
      dataType: 'json',
      async: true,
      success: successCallBack
    });
  }

  static startservice(){
    $.ajax({
      url: '/api/v1/cs/conversation/startservice',
      type: 'GET',
      dataType: 'json',
      async: true,
      error:function (jqXHR ,  textStatus,  errorThrown) {
        log.error("startservice",jqXHR,textStatus,errorThrown)
      },
      success: function(){}
    });
  }

  static getMoreMessage(uid,maxtime,successCallBack,count){
    if(!count)count =3;
    $.ajax({
      url: '/api/v1/cs/message/getmessagelist?uid='+uid+"&maxtime="+maxtime+"&count="+count,
      type: 'GET',
      dataType: 'json',
      async: true,
      success: successCallBack
    });
  }

  static getBottomMoreMessage(uid,mintime,successCallBack,count){
    if(!count){
      count = 3;
    }
    $.ajax({
      url: '/api/v1/cs/message/getmessagelist?uid='+uid+"&mintime="+mintime +"&count="+count,
      type: 'GET',
      dataType: 'json',
      async: true,
      success: successCallBack
    });
  }

  static closeConversation(uid,successCallBack){
    $.ajax({
      url: '/api/v1/cs/conversation/closeconv?uid='+uid,
      type: 'GET',
      dataType: 'json',
      async: true,
      success: successCallBack,
      error: function (  jqXHR,  textStatus, errorThrown) {
        console.log("error!",jqXHR,textStatus,errorThrown)
      }
    });
  }

  static getActiveAgentList(successCallBack){
    $.ajax({
      url: "/api/v1/cs/agent/getactiveagentlist",
      type: 'GET',
      dataType: 'json',
      async: true,
      success: successCallBack
    });
  }

  static transferConversation(uid,aid,successHandler){
    $.ajax({
      url: "/api/v1/cs/conversation/transferconv2specifiedagent?uid="+uid+"&toaid="+aid,
      type: 'GET',
      dataType: 'json',
      async: true,
      success: successHandler
    });
  }

  static syncConversation(successHandler){
    $.ajax({
      url: '/api/v1/cs/conversation/syncconvlist',
      type: 'POST',
      data: JSON.stringify(MessageStore.getSyncObjs()),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      error:function (jqXHR ,  textStatus,  errorThrown) {
        log.error("syncConversation",jqXHR,textStatus,errorThrown)
      },
      success: successHandler
    });
  }

  static getAllQuickList(successHandler){
    $.ajax({
      url: "/api/v1/cs/quickreply/listallreplys",
      type: 'GET',
      dataType: 'json',
      async: true,
      success: successHandler
    });
  }

  static getVisits(uid,getVisitSuccessHandler){
    $.ajax({
      url: "/api/v1/cs/statistics/getuserstats?uid="+uid,
      type: 'GET',
      dataType: 'json',
      async: true,
      success: getVisitSuccessHandler
    });
  }
  static getCsUserProfile(uid,getCsUserProfileHandler){
    $.ajax({
      url: "/api/v1/cs/userprofile/profile/"+uid,
      type: 'GET',
      dataType: 'json',
      async: true,
      success: getCsUserProfileHandler
    });
  }
  static saveRemark(uid,remark,saveRemarkSuccessHandler){
    $.ajax({
      url: "/api/v1/cs/userprofile/remark/"+uid,
      type: 'PUT',
      data: JSON.stringify({"remark":remark}),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: saveRemarkSuccessHandler
    });
  }
  static getAllAvailableTags(getAllAvailableTagsSuccessHandler){
    $.ajax({
      url: "/api/v1/cs/user_tag",
      type: 'GET',
      dataType: 'json',
      async: true,
      success: getAllAvailableTagsSuccessHandler
    });
  }

  static didSetTag(uid,tag_id,didSetTagSuccessHandler){
    $.ajax({
      url: "/api/v1/cs/userprofile/tagid/"+uid,
      type: 'PUT',
      data: JSON.stringify({"tag_id":tag_id}),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: didSetTagSuccessHandler
    });
  }

  static deleteTag(uid,deleteTagSuccessHandler){
    $.ajax({
      url: "/api/v1/cs/userprofile/tagid/"+uid,
      type: 'DELETE',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: deleteTagSuccessHandler
    });
  }

  static resetunread(conv_id){
    if(!conv_id){
      log.warn("resetunread conv_id=" + conv_id)
      return;
    }
    $.ajax({
      url: "/api/v1/cs/conversation/resetunread?convId[]="+conv_id,
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: function () {
      }
    });
  }

  static getWaiting(successHanlder){
    $.ajax({
      url: "/api/v1/cs/statistics/getwaiting",
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      error:function (jqXHR ,  textStatus,  errorThrown) {
        log.error("getWaiting",jqXHR,textStatus,errorThrown)
      },
      success: successHanlder
    });
  }




}

export default ChatWebAPIUtils;