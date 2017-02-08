import React from 'react'
import RouteComponent from 'app/RouteComponent'
import $ from "jquery"
import Lang from "lang/Lang"
import tools from 'utils/tools'
import EmojiPicker from "utils/EmojiPicker"
import TextMessage from "app/chat/components/TextMessage.react"

var pageLeaveTag = false;
export class Broadcast extends RouteComponent{
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    componentWillMount(){
        require.ensure([], function() {
            require('static/css/common.css');
            require('static/css/reset.css');
            require('static/css/emoji/lib/css/nanoscroller.css');
            require('static/css/emoji/lib/css/emoji.css');
            require('static/css/broadcastOrignal.css');
        }.bind(this));
    }

    componentDidMount(){
        var self = this;
        $(function(){
            //$("textarea").val("😊😊😀😁😉sdfs");
            $(".textBox").on("input paste keyup",".emoji-wysiwyg-editor",function(e){
                var pasteTxt = '';
                var text = $(this).text();
                var paste = e.originalEvent.clipboardData;
                if (e.type==='paste'&&paste) {
                    pasteTxt = paste.getData("text");
                    text += pasteTxt;
                }
                var startLen=$(this).text().length+$(this).find("img").length;
                var len=text.length+$(this).find("img").length;
                //var len=$("textarea").val().length;
                if(len>600){
                    var textCon=$("textarea").val().slice(0,600);
                    $("textarea").val(textCon);
                    if (e.type==='paste'&&paste){
                        var subLen = 600-startLen;
                        var subText = pasteTxt.substr(0,subLen);
                        $(this).append(subText);
                    }
                    len=600;
                    $(".textBox .numtip em").text(len);
                    $(".textBox .numtip").addClass("hasMaxLength");
                    return false;

                }else if(len===600){
                    $(".textBox .numtip").addClass("hasMaxLength");
                }else{
                    $(".textBox .numtip").removeClass("hasMaxLength");
                }
                $(".textBox .numtip em").text(len);
            })

            $("textarea").change(function(){
                $(this).val($(this).val().slice(0,600));
            })
            //获取页面list
            var getMainList=function(page){
                if(mypower){
                    return false;
                }
                mypower=true;
                $.ajax({
                    url: "api/v1/official/article/list?type=1&filtercopyed=1&page="+page,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(cont, txtStatus, xhr){
                        mypower=false;
                        var scrollConAuto =$(".scrollConAuto .childCon"),
                            imgWordsList="";
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        if(data.length==0){
                            $(".imgWordsListDialog").removeClass("hidden");
                            //当没有内容的时候隐藏view more按钮
                            $(".getMore").addClass("hidden");
                            if (page===0){
                                scrollConAuto.html('');
                                $(".content").addClass("hidden");
                                $(".noData").removeClass("hidden");
                            }
                            $.loaded();
                            return false;
                        }
                        $(".noData").addClass("hidden");
                        $(".content").removeClass("hidden");
                        if(data.length<10){
                            //当没有内容的时候隐藏view more按钮
                            $(".getMore").addClass("hidden");
                        }else if(data.length==10){
                            if(data.length+$(".imgWordsList").length==allMessageNum){
                                //当前条数是10,加上已经请求回来的等于总条数,表示已经全部请求回来了,隐藏view more按钮
                                $(".getMore").addClass("hidden");
                            }else{
                                //当有内容的时候显示view more按钮
                                $(".getMore").removeClass("hidden");
                            }
                        }else{
                            //当有内容的时候显示view more按钮
                            $(".getMore").removeClass("hidden");
                        }

                        $.each(data,function(i,d){
                            var li="";
                            var drafting="";
                            if(d.message.state==0){//0为草稿状态,1为已发送
                                drafting="drafting";
                            }
                            //获得文章的信息
                            if(d.content.length==0){
                                return false;
                            }
                            var times = new Date(d.message.updated).format();
                            $.each(d.content,function(ii,dd){
                                var titleOrContent="";
                                var imgsrc=dd.cover_link;
                                if(!(imgsrc&&imgsrc!=="null")){
                                    imgsrc=require('static/images/broadcast/defaultImg.png');
                                }
                                if(d.message.type==1){//0=文本消息、1=图文消息
                                    titleOrContent=dd.title;
                                }else{
                                    //titleOrContent=dd.content;
                                    //把后台传过来的字符转换成图片
                                    titleOrContent=TextMessage.getTextMessageContent(dd.content);
                                    imgsrc=require('static/images/broadcast/txtpic.jpg');
                                }
                                var disTime = ii===0?times:'';
                                var user = ii===0?Lang.str("app_article_sentto_all"):'';
                                li+='<li class="'+drafting+'">'
                                    //+'<img src="'+imgsrc+'" alt="" />'
                                    +'<div class="img" style="background: url('+self.resetImagePath(imgsrc,100,100)+') no-repeat 0 0"></div>'
                                    +'<h3>'
                                    +'<span class="leftCon summary"><span class="doing">['+Lang.str("app_article_draft")+'] </span><span class="title">'+titleOrContent+'</span></span>'
                                    +'<span class="date">'+disTime+'</span>'
                                    +'</h3>'
                                    +'<p>'
                                    +'<span class="leftCon">'
                                    +'<em class="visit">'+Lang.str("app_article_visits")+' <em>'+dd.visits+'</em></em>'
                                    +'<em class="good">'+dd.likes+'</em>'
                                    +'<em class="ding">'+dd.forwards+'</em>'
                                    +'</span>'
                                    +'<span class="user">'+user+'</span>'
                                    +'</p>'
                                    +'</li>';

                            })
                            //获得每条消息的信息
                            imgWordsList+='<div class="imgWordsList" msg_id="'+d.message.msg_id+'"><input class="checkit" type="checkbox" /><ul>'+li+'</ul></div>';

                        })

                        //如果第一次点击searchit,需要清空articleCon的getMainlist内容再append随后的内容
                        if(page==0){
                            scrollConAuto.empty().append(imgWordsList);
                        }else{
                            scrollConAuto.append(imgWordsList);
                        }
                        $.loaded();
                        $(".imgWordsListDialog").removeClass("hidden");
                    },
                    error:function(){
                        mypower=false;
                    }
                });
            }
            //点击searchit获取页面list
            var getSearchList=function(page,query){
                if(mypower){
                    return false;
                }
                mypower=true;
                $.ajax({
                    url: "/api/v1/official/article/search?type=1&filtercopyed=1&page="+page,
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data:JSON.stringify({"query":query}),
                    success: function(cont, txtStatus, xhr){
                        mypower=false;
                        var scrollConAuto =$(".scrollConAuto .childCon"),
                            imgWordsList="";
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        if(data.length==0){
                            $(".imgWordsListDialog").removeClass("hidden");
                            //当没有内容的时候隐藏view more按钮
                            $(".getMore").addClass("hidden");
                            if (page===0){
                                scrollConAuto.html('');
                                $(".content").addClass("hidden");
                                $(".noData").removeClass("hidden");
                            }
                            $.loaded();
                            return false;
                        }
                        $(".noData").addClass("hidden");
                        $(".content").removeClass("hidden");

                        if(data.length<10){
                            //当没有内容的时候隐藏view more按钮
                            $(".getMore").addClass("hidden");
                        }else if(data.length==10){
                            if(data.length+$(".imgWordsList").length==allMessageNum){
                                //当前条数是10,加上已经请求回来的等于总条数,表示已经全部请求回来了,隐藏view more按钮
                                $(".getMore").addClass("hidden");
                            }else{
                                //当有内容的时候显示view more按钮
                                $(".getMore").removeClass("hidden");
                            }
                        }else{
                            //当有内容的时候显示view more按钮
                            $(".getMore").removeClass("hidden");
                        }

                        $.each(data,function(i,d){
                            var li="";
                            var drafting="";
                            if(d.message.state==0){//0为草稿状态,1为已发送
                                drafting="drafting";
                            }
                            //获得文章的信息
                            if(d.content.length==0){
                                return false;
                            }
                            var times = new Date(d.message.updated).format();
                            $.each(d.content,function(ii,dd){
                                var titleOrContent="";
                                var imgsrc=dd.cover_link;
                                if(!(imgsrc&&imgsrc!=="null")){
                                    imgsrc=require('static/images/broadcast/defaultImg.png');
                                }
                                if(d.message.type==1){//0=文本消息、1=图文消息
                                    titleOrContent=dd.title;
                                }else{
                                    //titleOrContent=dd.content;
                                    //把后台传过来的字符转换成图片
                                    titleOrContent=TextMessage.getTextMessageContent(dd.content);
                                    imgsrc=require('static/images/broadcast/txtpic.jpg');
                                }
                                var disTime = ii===0?times:'';
                                var user = ii===0?Lang.str("app_article_sentto_all"):'';
                                li+='<li class="'+drafting+'">'
                                        //+'<img src="'+imgsrc+'" alt="" />'
                                    +'<div class="img" style="background: url('+self.resetImagePath(imgsrc,100,100)+') no-repeat 0 0"></div>'
                                    +'<h3>'
                                    +'<span class="leftCon summary"><span class="doing">[Draft] </span><span class="title">'+titleOrContent+'</span></span>'
                                    +'<span class="date">'+disTime+'</span>'
                                    +'</h3>'
                                    +'<p>'
                                    +'<span class="leftCon">'
                                    +'<em class="visit">Visits <em>'+dd.visits+'</em></em>'
                                    +'<em class="good">'+dd.likes+'</em>'
                                    +'<em class="ding">'+dd.forwards+'</em>'
                                    +'</span>'
                                    +'<span class="user">'+user+'</span>'
                                    +'</p>'
                                    +'</li>';

                            })
                            //获得每条消息的信息
                            imgWordsList+='<div class="imgWordsList" msg_id="'+d.message.msg_id+'"><input class="checkit" type="checkbox" /><ul>'+li+'</ul></div>';

                        })

                        //如果第一次点击searchit,需要清空articleCon的getMainlist内容再append随后的内容
                        if(page==0){
                            scrollConAuto.empty().append(imgWordsList);
                        }else{
                            scrollConAuto.append(imgWordsList);
                        }
                        $.loaded();
                        $(".imgWordsListDialog").removeClass("hidden");
                    },
                    error:function(){
                        mypower=false;
                    }
                });
            }
            //默认请求第1页的列表
            var page=0,
                searchPage=0,
                mypower=false,
                getMainListType=true;
            $(".scrollConAuto").on("click",".getMore",function(){
                if(getMainListType){
                    page++;
                    getMainList(page);
                }else{
                    searchPage++;
                    var query=$(".searchInput").val();
                    getSearchList(searchPage,query);
                }
            })
            //searchit点击获取search的页面
            $(".searchit").click(function(){
                $.loadding();
                var query=$(".searchInput").val();
                $(".noData").addClass("hidden");
                $(".getMore").addClass("hidden");
                $(".scrollConAuto .childCon").html('');
                if(query.length==0){
                    //初始化
                    page=0,
                    searchPage=0,
                    mypower=false,
                    getMainListType=true;

                    getMainList(0);
                    getAllMessageNum(function (cont, txtStatus, xhr) {
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        $(".conHead p .num").text(Lang.str('app_article_inTotal',data.messageCount));
                        allMessageNum=data.messageCount;
                        //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                        //默认请求第1页的列表
                        getMainList(page);
                    });
                    return false;
                }
                getMainListType=false;
                searchPage=0;

                getAllMessageNum(function (cont, txtStatus, xhr) {
                    if(xhr.status!=200){
                        return false;
                    }
                    var data=xhr.responseJSON;
                    $(".conHead p .num").text(Lang.str('app_article_inTotal',data.messageCount));
                    allMessageNum=data.messageCount;
                    //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                    //默认请求第1页的列表
                    //getMainList(page);
                    //获得总条数之后在请求数据可以判断返回条数等于10的情况
                    getSearchList(searchPage,query);
                });
            })
            //输入框回车获取search的页面
            $(".searchInput").keyup(function(event){
                if(event.keyCode ==13){
                    $.loadding();
                    var query=$(".searchInput").val();
                    $(".noData").addClass("hidden");
                    $(".getMore").addClass("hidden");
                    $(".scrollConAuto .childCon").html('');
                    if(query.length==0){
                        //初始化
                        page=0,
                        searchPage=0,
                        mypower=false,
                        getMainListType=true;

                        getMainList(0);
                        getAllMessageNum(function (cont, txtStatus, xhr) {
                            if(xhr.status!=200){
                                return false;
                            }
                            var data=xhr.responseJSON;
                            $(".conHead p .num").text(Lang.str('app_article_inTotal',data.messageCount));
                            allMessageNum=data.messageCount;
                            //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                            //默认请求第1页的列表
                            getMainList(page);
                        });
                        return false;
                    }
                    getMainListType=false;
                    searchPage=0;
                    getAllMessageNum(function (cont, txtStatus, xhr) {
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        $(".conHead p .num").text(Lang.str('app_article_inTotal',data.messageCount));
                        allMessageNum=data.messageCount;
                        //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                        //默认请求第1页的列表
                        //getMainList(page);
                        //获得总条数之后在请求数据可以判断返回条数等于10的情况
                        getSearchList(searchPage,query);
                    });
                }
            });


            $(".createAccess .selectDatabase").click(function(){
                //初始化
                $(".scrollConAuto .childCon").html("");
                $(".searchInput").val('');
                page=0,
                searchPage=0,
                mypower=false,
                getMainListType=true;

                messageId="";
                var strs = Lang.str("app_chat_UserTransferAConversation",1,3);
                $(".imgWordsListDialog .btnBox .ok").addClass("disabled").removeClass("active");

                //getMainList(page);
                //请求所有消息的个数
                getAllMessageNum(function (cont, txtStatus, xhr) {
                    if(xhr.status!=200){
                        return false;
                    }
                    var data=xhr.responseJSON;
                    $(".conHead p .num").text(Lang.str('app_article_inTotal',data.messageCount));
                    allMessageNum=data.messageCount;
                    //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                    //默认请求第1页的列表
                    getMainList(page);
                });

            });
            //请求所有消息的个数
            var allMessageNum;
            var getAllMessageNum=function(callback) {
                var searchText = $(".searchInput").val();
                var keyEncode = encodeURIComponent(encodeURIComponent(searchText));
                var url = "/api/v1/official/article/messagecount?type=1&filtercopyed=1";
                if (keyEncode){
                    url += "&query="+keyEncode;
                }
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: callback
                })
            }

            //当前还能发送多少条数据
            var getCanSendNum=function() {
                $.ajax({
                    url: "/api/v1/official/article/availablesendcount",
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (cont, txtStatus, xhr) {
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        $(".sendTip em").text(data.count);
                    }
                })
            }
            getCanSendNum();



            //close
            $(".dialogHead .close").click(function(){
                $(".broadcastDialog").addClass("hidden");
            })
            //check ischecked
            var messageId="";
            $(".scrollConAuto").on("click",".checkit",function(){
                if($(this).prop("checked")){
                    messageId=$(this).closest(".imgWordsList").attr("msg_id");
                    $(this).closest(".imgWordsList").siblings(".imgWordsList").find(".checkit").prop("checked",false);
                }
                var power=false;
                $(".imgWordsList .checkit").each(function(){
                    if($(this).prop("checked")){
                        power=true;
                        return false;
                    }
                })
                if(power){
                    $(".imgWordsListDialog .btnBox .ok").removeClass("disabled").addClass("active");
                }else{
                    $(".imgWordsListDialog .btnBox .ok").addClass("disabled").removeClass("active");
                }
            })

            // imgWordsListDialog ok click
            $(".imgWordsListDialog .btnBox .ok").click(function(){
                if(!$(this).hasClass("active")){
                    return false;
                }
                $.ajax({
                    type: "GET",
                    url: "/api/v1/official/article/message/"+messageId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (cont, txtStatus, xhr) {
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        var mydata=data.content;
                        var li="",
                            last=mydata.length- 1;
                        $.each(mydata,function(i,d){
                            var firstClass="",
                                lastClass="",
                                closeHtml="",
                                abstractEmpty="",
                                sn="";
                            var imgsrc=d.cover_link;
                            var dataImage = imgsrc?imgsrc:"";
                            var disImg = '';
                            if(i==0){
                                firstClass="first";
                                disImg = self.resetImagePath(imgsrc,250,140);
                            }
                            else{
                                disImg = self.resetImagePath(imgsrc,60,60);
                            }
                            if(last==i){
                                lastClass="last";
                                closeHtml='<a class="close" href="javascript:;"></a><a class="editor" href="/ArticalEditor?msg_id='+messageId+'"></a>';
                            }

                            if(d.type==0){//0=文本消息、1=图文消息
                                disImg=require('static/images/broadcast/txtpic.jpg');
                            }
                            if(!(imgsrc&&imgsrc!=="null")){
                                if(i==0){
                                    disImg=require('static/images/broadcast/defaultImg_huge.png');
                                }
                                else{
                                    disImg=require('static/images/broadcast/defaultImg.png');
                                }
                            }
                            var time = new Date(d.updated).format();
                            var host=location.host;
                            if(d.sn){
                                sn=d.sn;
                            }
                            //如果只有一项,显示成单独样式
                            if(d.ct_abstract==""){
                                abstractEmpty="hidden";
                            }
                            if(last==0){
                                li+='<li class="'+lastClass+' onlyone clearfix" data-image="'+dataImage+'" data-title="'+d.title+'" data-show-cover="'+d.show_cover+'" data-cover-link="'+d.cover_link+'" data-has-orig-link="'+d.has_orig_link+'" data-orig-link="'+d.orig_link+'" data-content="'+encodeURIComponent(d.content)+'">'
                                    +'<h3 class="onlyoneTitle"><a class="getOutPage" href="http://'+host+'/contentservice/getpage?cid='+d.content_id+'&sn='+sn+'" target="_blank">'+ d.title+'</a></h3>'
                                    +'<span class="onlyoneTime">'+time+'</span>'
                                    +'<div class="img" style="background: url('+disImg+') no-repeat 0 0"></div>'
                                    +'<span class="onlyoneAbstract '+abstractEmpty+'">'+d.ct_abstract+'</span>'
                                    +closeHtml
                                    +'</li>'
                            }else{
                                li+='<li class="'+firstClass+' '+lastClass+' clearfix" data-image="'+dataImage+'" data-title="'+d.title+'" data-show-cover="'+d.show_cover+'" data-cover-link="'+d.cover_link+'" data-has-orig-link="'+d.has_orig_link+'" data-orig-link="'+d.orig_link+'" data-content="'+encodeURIComponent(d.content)+'">'
                                        //+'<img src="'+ imgsrc+'" alt="" />'
                                    +'<div class="img" style="background: url('+disImg+') no-repeat 0 0"></div>'
                                    +'<p><span class="shadow"></span><a class="getOutPage" href="http://'+host+'/contentservice/getpage?cid='+d.content_id+'&sn='+sn+'" target="_blank">'+ d.title+'</a><span class="time">'+ time+'</span></p>'
                                    +closeHtml
                                    +'</li>'
                            }

                        })
                        $(".imgWordlist ul").html(li);
                        $(".mediaCover").addClass("hidden");
                        $(".imgWordlist").attr("messageId",messageId).removeClass("hidden");
                    }
                });
                $(".broadcastDialog").addClass("hidden");
            })

            // cancel click
            $(".dialogfoot .btnBox .cancel").click(function(){
                $(".broadcastSendDialog .btnBox .ok").removeClass("disabled");
                $(".broadcastDialog").addClass("hidden");
            })

            $(".imgWordlist").on("click",".close",function(){
                $(".imgWordlist").addClass("hidden");
                $(".mediaCover").removeClass("hidden");
            })

            $(".categorySwitch a").click(function(){
                if($(this).hasClass("richText")){
                    $(".richTextBox").removeClass("hidden");
                    $(".textBox").addClass("hidden");
                    $(".preview").addClass("hidden");
                }else{
                    $(".richTextBox").addClass("hidden");
                    $(".textBox").removeClass("hidden");
                    $(".preview").removeClass("hidden");
                }
                $(this).addClass("active").siblings("a").removeClass("active");
            })
            //点击发送
            $(".broadcastSend").click(function(){
                if(!$(".richTextBox").hasClass("hidden")&&!$(".imgWordlist").hasClass("hidden")){
                    var nodeList = $(".imgWordlist>ul>li");
                    var result = false,msg = Lang.str("app_broadcast_needCompleteArticleMsg");
                    if (nodeList.length>0){
                        for(var i = 0;i < nodeList.length;i++){
                            result = true;
                            var v = $(nodeList[i]);
                            var title = v.attr("data-title");
                            var image = v.attr("data-image");
                            var content = v.attr("data-content");
                            var cover_link = v.attr("data-cover-link");
                            var show_cover = v.attr("data-show-cover");
                            var has_orig_link = v.attr("data-has-orig-link");
                            var orig_link = v.attr("data-orig-link");
                            var check_origLink = (has_orig_link==='true'&&orig_link)||has_orig_link==='false';
                            if (!(title&&image&&(content||(show_cover==='true'&&cover_link))&&check_origLink)){
                                result = false;
                                msg = Lang.str("app_broadcast_completeArticle");
                                break;
                            }
                        }
                    }
                    if (result){
                        $(".broadcastSendDialog").removeClass("hidden");
                    }
                    else{
                        $.messageBox({message:msg,level: "error"});
                    }

                }else if(!$(".textBox").hasClass("hidden")){
                    var textareaVal=$("textarea.textCont").val();
                    if(textareaVal){
                        $('.textErrorTip').fadeOut();
                        $(".broadcastSendDialog").removeClass("hidden");
                    }else {
                        $('.textErrorTip').fadeIn();
                    }
                }
            })

            // broadcastSendDialog ok click
            $(".broadcastSendDialog .btnBox .ok").click(function(){
                var msg_id="";
                var target = $(event.currentTarget);
                if (!target.hasClass("disabled")) {
                    target.addClass("disabled");
                    if (!$(".richTextBox").hasClass("hidden")) {
                        if (!$(".imgWordlist").hasClass("hidden")) {
                            msg_id = parseFloat($(".imgWordlist").attr("messageid"));
                            var ajaxTimeOut = $.ajax({
                                url: "/api/v1/official/article/sendgroup",
                                type: "PUT",
                                data: JSON.stringify({"msg_id": msg_id}),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (cont, txtStatus, xhr) {
                                    if (xhr.status == 200) {
                                        $(".inputBox .numtip em").html('0');
                                        $(".broadcastSendDialog").addClass("hidden");
                                        $.messageBox({
                                            message: Lang.str("app_broadcast_sendSuccess"),
                                            level: "success"
                                        });
                                    } else if (xhr.status == 207) {
                                        $.messageBox({message: Lang.str("system_AjaxError_500"), level: "error"});
                                    }
                                    //当前还能发送多少条数据
                                    getCanSendNum();
                                    //恢复到初始状
                                    $(".imgWordlist").addClass("hidden").find("ul").html("");
                                    $(".mediaCover").removeClass("hidden");
                                    target.removeClass("disabled");
                                }
                            });
                            setTimeout(function(){
                                if (ajaxTimeOut.state()==='pending'){
                                    ajaxTimeOut.abort();
                                    target.removeClass("disabled");
                                    $(".broadcastSendDialog").addClass("hidden");
                                    $.messageBox({message: Lang.str("system_AjaxError_408"), level: "error"});
                                }
                            },10000);
                        }
                    } else if (!$(".textBox").hasClass("hidden")) {
                        var textareaVal = $("textarea.textCont").val().slice(0, 600);
                        var ajaxTimeOut = $.ajax({
                            url: "/api/v1/official/article/sendtext",
                            type: "PUT",
                            data: JSON.stringify({"content": textareaVal}),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (cont, txtStatus, xhr) {
                                if (xhr.status == 200) {
                                    $("textarea.textCont").val('');
                                    $(".emoji-wysiwyg-editor").html('');
                                    $(".inputBox .numtip em").html('0');
                                    $(".inputBox .numtip").removeClass("hasMaxLength");
                                    $(".broadcastSendDialog").addClass("hidden");
                                    $.messageBox({message: Lang.str("app_broadcast_sendSuccess"), level: "success"});
                                } else if (xhr.status == 207) {
                                    $.messageBox({message: Lang.str("system_AjaxError_500"), level: "error"});
                                }
                                //当前还能发送多少条数据
                                getCanSendNum();
                                //恢复到初始状
                                $(".imgWordlist").addClass("hidden").find("ul").html("");
                                $(".mediaCover").removeClass("hidden");
                                target.removeClass("disabled");
                                //保存成功,pageLeaveTag设为初始值false,跳转页面不需要提示
                                pageLeaveTag = false;
                            }
                        });

                        setTimeout(function(){
                            if (ajaxTimeOut.state()==='pending'){
                                ajaxTimeOut.abort();
                                target.removeClass("disabled");
                                $(".broadcastSendDialog").addClass("hidden");
                                $.messageBox({message: Lang.str("system_AjaxError_408"), level: "error"});
                            }
                        },10000);
                    }

                }
            })

            $(".textCont").attr("maxLength","600");
         // Initializes and creates emoji set from sprite sheet
                window.emojiPicker = new EmojiPicker({
                    emojiable_selector: '[data-emojiable=true]',
                    assetsPath: 'https://d51wm8y7a2ot9.cloudfront.net/official-account/emoji/img',
                    popupButtonClasses: 'fa fa-smile-o',
                    normalTime:false
                });
                // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
                // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
                // It can be called as many times as necessary; previously converted input fields will not be converted again
                window.emojiPicker.discover();

        })



    }


    handlePreviewClick() {
        var textareaVal=$("textarea.textCont").val();
        if(textareaVal){
            $('.textErrorTip').fadeOut();
            $(".previewDialog").removeClass("hidden");
        }else {
            $('.textErrorTip').fadeIn();
        }
    }

    handlePreviewOk() {
        var currentNode = $(".previewDialog .btnBox .ok");
        if (currentNode.hasClass("disabled")){
            return false;
        }
        var areaNumber=$(".areaNumber").val();
        var previewTxt=$(".previewTxt").val();
        var phoneNum = parseInt(areaNumber+previewTxt);
        var touids=[phoneNum];
        var textareaVal = $("textarea.textCont").val().slice(0, 600);
        var ajaxTimeOut = $.ajax({
            url: "/api/v1/official/article/sendsingletxt",
            type: "PUT",
            data: JSON.stringify({
                "touids": touids,
                "txt": textareaVal
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (cont, txtStatus, xhr) {
                if (xhr.status == 200) {
                    $("textarea.textCont").val('');
                    $(".emoji-wysiwyg-editor").html('');
                    $(".inputBox .numtip em").html('0');
                    $(".inputBox .numtip").removeClass("hasMaxLength");
                    $(".previewDialog").addClass("hidden");
                    $.messageBox({message: Lang.str("app_broadcast_sendSuccess"), level: "success"});
                } else if (xhr.status == 207) {
                    $.messageBox({message: Lang.str("system_AjaxError_500"), level: "error"});
                }
                //当前还能发送多少条数据
                var getCanSendNum=function() {
                    $.ajax({
                        url: "/api/v1/official/article/availablesendcount",
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (cont, txtStatus, xhr) {
                            if(xhr.status!=200){
                                return false;
                            }
                            var data=xhr.responseJSON;
                            $(".sendTip em").text(data.count);
                        }
                    })
                }
                getCanSendNum();
                //恢复到初始状
                $(".imgWordlist").addClass("hidden").find("ul").html("");
                $(".mediaCover").removeClass("hidden");
                currentNode.removeClass("disabled");
                //保存成功,pageLeaveTag设为初始值false,跳转页面不需要提示
                pageLeaveTag = false;
            }
        });

        setTimeout(function(){
            if (ajaxTimeOut.state()==='pending'){
                ajaxTimeOut.abort();
                currentNode.removeClass("disabled");
                $(".previewDialog").addClass("hidden");
                $.messageBox({message: Lang.str("system_AjaxError_408"), level: "error"});
            }
        },10000);
    }

    serviceLimitKeyup(e){
        var obj = e.target;
        obj.value=obj.value.replace(/\D/gi,"");
    }


    resetImagePath(url,width,height){
        if (url&&/(.png|.jpg|.jpeg|.bmp|.gif)$/.test(url)){
            var index = url.lastIndexOf(".");
            var startUrl = url.substring(0,index);
            url = url.replace(startUrl, startUrl+'_'+width+'x'+height);
        }
        return url;
    }

    render(){
        let sendBroadcastNMsg = Lang.str("app_broadcast_sendBroadcastNMsg",'<em></em>');
        return (
        <div>
            <div id="broadcast">
                <header className="broadcastHeader">
                    <h2>{Lang.str('app_broadcast_broadcast')}</h2>
                </header>

                <section className="categorySwitch">
                    <a className="richText active">{Lang.str('app_broadcast_imageTextBroadcast')}</a>
                    <a className="text">{Lang.str('app_broadcast_textBroadcast')}</a>
                </section>

                <div className="tabContCover clearfix">
                    <div className="richTextBox">
                        <div className="mediaCover">
                            <span className="createAccess">
                                <a className="newBroadcast" href="/ArticalEditor" data-type="10" data-index="0">
                                    <i className="addGray"></i>
                                    <strong>{Lang.str("app_broadcast_newBroadcast")}</strong>
                                </a>
                            </span>
                        </div>
                        <div className="mediaCover">
                            <span className="createAccess">
                                <a className="selectDatabase" href="javascript:;">
                                    <i className="addGray"></i>
                                    <strong>{Lang.str("app_broadcast_selectDatabase")}</strong>
                                </a>
                            </span>
                        </div>
                        <div className="imgWordlist hidden">
                            <ul>

                            </ul>
                        </div>
                    </div>
                    <div className="textBox hidden">
                        <textarea maxlength="600" cols="5" rows="5" className="textCont" data-emojiable="true" placeholder={Lang.str('app_broadcast_pleaseEnter')}></textarea>
                        <span className="textErrorTip">{Lang.str("app_broadcast_fieldNotEmpty")}</span>
                        <div className="inputBox">
                            <span className="numtip"><em>0</em>/600</span>
                            <span className="icons"></span>
                        </div>
                    </div>
                </div>

                <footer>
                    <div className="articalEditorFooter textFooter">
                        <button className="broadcastSend">{Lang.str("app_broadcast_send")}</button>
                        <span className="sendTip"><strong>*</strong><span dangerouslySetInnerHTML={{"__html":sendBroadcastNMsg}}></span></span>
                        <a className="preview hidden" onClick={this.handlePreviewClick.bind(this)}>{Lang.str("app_broadcast_preview")}</a>
                    </div>
                    
                </footer>

            </div>
            <div className="broadcastDialog spceDialog imgWordsListDialog dialogShadow hidden">
                <div className="dialogWrap">
                    <div className="dialogHead">
                        <h2>{Lang.str("app_broadcast_selectDatabase")}</h2>
                        <a className="close" href="javascript:;"></a>
                    </div>
                    <div className="dialogContent">
                        <div className="conHead clearfix">
                            <p><span className="num"></span></p>
                            <div className="searchBox">
                                <a className="searchit" href="javascript:;"></a>
                                <input className="searchInput" placeholder={Lang.str('app_broadcast_searchInput_placeholder')} type="text" />
                            </div>
                        </div>
                        <div className="scrollConAuto">
                            <div className="childCon"></div>
                            <a className="getMore hidden" href="javascript:;">{Lang.str("app_broadcast_viewMore")}</a>
                        </div>
                    </div>
                    <div className="noData hidden">
                        {Lang.str("app_article_noQueryResult")}
                    </div>
                    <div className="dialogfoot">
                        <div className="clearfix btnBox">
                            <a className="ok disabled" href="javascript:;">{Lang.str("app_broadcast_ok")}</a>
                            <a className="cancel" href="javascript:;">{Lang.str("app_broadcast_cancel")}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="broadcastDialog deactivateDialog broadcastSendDialog dialogShadow hidden">
                <div className="dialogWrap">
                    <div className="dialogHead">
                        <h2>{Lang.str("app_broadcast_sendConfirmation")}</h2>
                        <a className="close" href="javascript:;"></a>
                    </div>
                    <div className="dialogContent">
                        <p className="msg">{Lang.str("app_broadcast_sendBroadcastHintMsg")}</p>
                    </div>
                    <div className="dialogfoot">
                        <div className="clearfix btnBox">
                            <a className="ok active" href="javascript:;">{Lang.str("app_broadcast_confirm")}</a>
                            <a className="cancel" href="javascript:;">{Lang.str("app_broadcast_cancel")}</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="broadcastDialog deactivateDialog previewDialog dialogShadow hidden">
                    <div className="dialogWrap">
                        <div className="dialogHead">
                            <h2>{Lang.str("app_broadcast_previewOnSoma")}</h2>
                            <a className="close" href="javascript:;"></a>
                        </div>
                        <div className="dialogContent">
                            <div className="previewCon">
                                <p>{Lang.str("app_broadcast_pleaseEnterMobileAdvers")}</p>
                                <div className="previewBox clearfix">
                                    <input className="areaNumber" type="text" maxlength="3" onKeyUp={this.serviceLimitKeyup.bind(this)} onInput={this.serviceLimitKeyup.bind(this)}/>
                                    <input maxlength="16" placeholder={Lang.str("app_broadcast_enterMobilePhoneNumMsg")} onKeyUp={this.serviceLimitKeyup.bind(this)} onInput={this.serviceLimitKeyup.bind(this)} className="previewTxt" type="text" />
                                </div>
                                <div>
                                    <p className="tip hidden notCorrect">*{Lang.str("app_broadcast_incorrentPhoneNumMsg")}</p>
                                    <p className="tip hidden notFollow">*{Lang.str("app_broadcast_notFollowPublicAccount")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="dialogfoot">
                            <div className="clearfix btnBox">
                                <a className="ok active" href="javascript:;" onClick={this.handlePreviewOk.bind(this)}>{Lang.str("app_broadcast_ok")}</a>
                                <a className="cancel" href="javascript:;">{Lang.str("app_broadcast_cancel")}</a>
                            </div>
                        </div>
                    </div>
                </div>

        </div>
        );
    }
}

export default Broadcast;
