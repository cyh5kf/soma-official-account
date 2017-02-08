import React from 'react'
import RouteComponent from 'app/RouteComponent'
import $ from "jquery"
import Simditor from 'simditor'
import tools from 'utils/tools'
import Lang from 'lang/Lang'

var intervalId = null;
var pageLeaveTag = false;
export class ArticalEditor extends RouteComponent{



    constructor(props){
        super(props);
        this.xhr = null;
        this.emptyImage = require('static/images/broadcast/defaultImg.png');
    }

    componentWillMount(){
        require.ensure([], function() {
            require('static/css/common.css');
            require('static/css/reset.css');
            require('static/css/broadcastOrignal.css');
            require('static/css/simditor/simditor.css');
        }.bind(this));
    }


    componentWillUnmount(){
        clearInterval(intervalId);

        window.onbeforeunload=null;
        //还原body,#wrapper的样式
        $("body").css("overflow","hidden");
        $("#wrapper").css("overflow-y","auto");

    }
    //点击菜单跳转到其他页面,弹出提示,点击确定就跳转,点击取消就不跳转
    static willTransitionFrom(transition,a){
        if(pageLeaveTag){
            if(!confirm("You have not saved the modifications. Are you sure you want to leave this page?")){
                transition.abort();
            }
        }

    }

    componentDidMount(){
        var self = this;
        $.loadding();
        $(function() {
            //simditor
            Simditor.locale = "en-US";
            var editor = new Simditor({
                textarea: $("#simditor"),
                placeholder: Lang.str("app_broadcast_edit_content"),
                defaultImage: 'images/image.png',
                params: {},
                upload: {
                    url: '/upload/file5/upload/article.json?type=image',
                    params: null,
                    fileKey: 'file',
                    connectionCount: 1,
                    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
                },
                tabIndent: true,
                toolbar: [
//                    'title',
                    'bold',
                    'italic',
                    'underline',
//                    'strikethrough',
                    'fontScale',
                    'color',
//                'ol',
//                'ul',
//                    'blockquote',
//                'code',
//                'table',
                    'link',
                    'hr',
                    'indent',
                    'outdent',
                    'alignment',
                    'image'
                ],
                toolbarFloat: true,
                toolbarFloatOffset: 0,
                toolbarHidden: false,
                pasteImage: true,
                cleanPaste: false,
                imageButton: 'upload'
            });
            //为了兼容toolbarFloat的功能,修改body,#wrapper的样式
            $("body").css("overflow","auto");
            $("#wrapper").css("overflow-y","visible");
            //simditor end
            $(".orig_link").attr({"maxlength":"256","autocomplete":"false"});
            $(".areaNumber").attr({"maxlength":"3","autocomplete":"false"});
            $(".previewTxt").attr({"maxlength":"16","autocomplete":"false"});
            var msg_id="";
            var autoSave=false;
            if(location.search.indexOf("msg_id")==-1){
                msg_id="";
                $.loaded();
                $(".show_cover").prop("checked",true);
            }else{
                msg_id = location.search.split("?msg_id=")[1];
                $.ajax({
                    type: "GET",
                    url: "/api/v1/official/article/message/"+msg_id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (cont, txtStatus, xhr) {
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        if(data.message.state==1){//0为草稿状态,1为已发送
                            //如果当前为已发送状态,把msg_id置为空,重新产生一条数据,可以修改发送
                            msg_id="";
                        }
                        var mydata=data.content;
                        if(mydata.length==0){
                            return false;
                        }
                        if (mydata.length>=8){
                            $("#jsaddAppmsg").addClass("hidden");
                        }
                        var li="",
                            last=mydata.length- 1;

                        $.each(mydata,function(i,d){
                            var firstClass="",
                                lastClass="",
                                currentClass="",
                                closeHtml="",
                                noCoverLink="none",
                                displayImg='';
                            if(i==0){
                                firstClass="firstItem";
                                currentClass="current";
                                displayImg = self.resetImagePath(d.cover_link,216,118);
                            }else if(last==i){
                                lastClass="lastItem";
                                displayImg = self.resetImagePath(d.cover_link,78,78);
                            }
                            else{
                                displayImg = self.resetImagePath(d.cover_link,78,78);
                            }

                            if(!d.cover_link){
                                noCoverLink="block";
                            }

                            li+='<div id="appmsgItem'+i+'" show_cover="'+d.show_cover+'" orig_link="'+d.orig_link+'" has_orig_link="'+d.has_orig_link+'" author="'+d.author+'" data-title="'+d.title+'" data-url="'+d.cover_link+'" ct_abstract="'+d.ct_abstract+'" content_id="'+d.content_id+'" content="'+encodeURIComponent(d.content)+'" class="jsappmsgItem appmsgItemWrap hasThumb '+firstClass+' '+currentClass+' '+lastClass+'">'

                                + '<div class="appmsgItem clearfix">'
                                +       '<div class="appmsgThumbWrap jsappmsgThumb" style="background-image: url('+displayImg+');">'
                                +           '<div class="appmsgThumb default" style="display:'+noCoverLink+';">'
                                +               '<i class="iconAppmsgThumbSmall"></i>'
                                +           '</div>'
                                +       '</div>'
                                +      '<h4 class="appmsgTitle js_appmsg_title">'+d.title+'</h4>'
                                +       '<div class="appmsgEditMask">'
                                +           '<a class="icon20Common sortUpWhite   jsup" data-id="1" href="javascript:;"></a>'
                                +           '<a class="icon20Common sortDownWhite jsdown" data-id="0" href="javascript:;"></a>'
                                +           '<a class="icon20Common delMediaWhite jsdel" data-id="0" href="javascript:;"></a>'
                                +        '</div>'
                                +  '</div>'
                                + '</div>'
                        })
                        var jsAppmsgPreview = $("#jsAppmsgPreview");
                        jsAppmsgPreview.html(li);
                        //回填各种值
                        $(".appmsgEditItem>.title input").val(mydata[0].title);
                        $(".appmsgEditItem>.author input").val(mydata[0].author);
                        editor.setValue(mydata[0].content);
                        editorFun();
                        $(".frmTextarea").val(mydata[0].ct_abstract);
                        $(".frmcounter .numtip").text(mydata[0].ct_abstract.length);
                        //重新设置摘要的字数,如果字数不足100,去掉.frmcounter的hasMaxLength类,等于100,加上.frmcounter的hasMaxLength类
                        if(mydata[0].ct_abstract.length<100){
                            $(".appmsgEdit .abstractTextarea .frmcounter").removeClass("hasMaxLength");
                        }else if(mydata[0].ct_abstract.length===100){
                            $(".appmsgEdit .abstractTextarea .frmcounter").addClass("hasMaxLength");
                        }

                        if(mydata[0].has_orig_link){
                            $(".has_orig_link").prop("checked",true);
                            $(".orig_link").val(mydata[0].orig_link).removeClass("hidden");
                        }else{
                            $(".has_orig_link").prop("checked",false);
                            $(".orig_link").val("").addClass("hidden");
                        }
                        $(".orig_link").val(mydata[0].orig_link);
                        if(mydata[0].show_cover){
                            $(".show_cover").prop("checked",true);
                        }else{
                            $(".show_cover").prop("checked",false);
                        }
                        //根据cover_link来设置图片地址
                        var cover_link = mydata[0].cover_link;
                        if(cover_link&&cover_link!=='null'){
                            $(".upimgBox img").removeClass("defaultImage").attr("src",self.resetImagePath(cover_link,72,72));
                            $(".upimgBox").removeClass("hidden");
                        }
                        //重设各自的background,没有cover_link设为none,这样才不会诡异的获取页面的的url
                        $.each(mydata,function(i,d){
                            if(!(d.cover_link&&d.cover_link!=='null')){
                                $(".jsappmsgItem").eq(i).attr("data-url","");
                                $(".jsappmsgItem").eq(i).find(".appmsgThumbWrap").css("background","none")
                            }
                        })
                        //firstItem下面的向下,向上,删除按钮默认是隐藏的(已用CSS控制实现),但是如果有多篇文章,firstItem下面的向下按钮应该是显示的
                        if(mydata.length>1){
                            $(".appmsgContent .firstItem .jsdown").show();
                        }
                        $.loaded();
                    }
                });

            }
            //原文链接checkbox选中,后面的存储原文链接的文本框显示,反之隐藏
            $(".has_orig_link").change(function(){
                if($(this).prop("checked")){
                    $(".orig_link").removeClass("hidden");
                }else{
                    $(".orig_link").addClass("hidden");
                }
                $(".errorTip4").fadeOut();
            })

            $(".show_cover").on('change',function(){
                var src = $(".upimgBox img").attr("src");
                if(this.checked&&src){
                    $(".errorTip2").fadeOut();
                }
                return false;
            })

            $(".orig_link").on('change input keydown',function(){
                var val = $(event.target).val();
                if ($.trim(val).length>0){
                    $(".errorTip4").fadeOut();
                }
            })

            var saveIt=function(arg_autoSave){
                //当前的current保存一下值
                var content = editor.getValue();
                var ct_abstract = $(".frmTextarea").val();
                var title = $(".title input").val();
                var author = $(".author input").val();
                var has_orig_link=$(".has_orig_link").prop("checked");
                var orig_link=$(".orig_link").val();
                var show_cover=$(".show_cover").prop("checked");
                var content_id = $(".current").attr("content_id");
                $(".current").attr({"show_cover":show_cover,"orig_link":orig_link,"has_orig_link":has_orig_link,"content_id":content_id,"content":encodeURIComponent(content),"ct_abstract":ct_abstract,"data-title":title,"author":author});

                var content=[];
                $("#jsAppmsgPreview .jsappmsgItem").each(function(i,d){
                    var obj={};
                    obj.content = decodeURIComponent($(d).attr("content"));
                    obj.ct_abstract = $(d).attr("ct_abstract");
                    obj.content_id = $(d).attr("content_id");
                    obj.seqnum = i;
                    obj.title = $(d).attr("data-title");
                    obj.author = $(d).attr("author");
                    obj.has_orig_link=$(d).attr("has_orig_link");
                    if(obj.has_orig_link=="true"){
                        obj.has_orig_link=true;
                        obj.orig_link=$(d).attr("orig_link");
                    }else if(obj.has_orig_link=="false"){
                        obj.has_orig_link=false;
                        obj.orig_link="";
                    }

                    obj.show_cover=$(d).attr("show_cover");
                    if(obj.show_cover=="true"){
                        obj.show_cover=true;
                    }else if(obj.show_cover=="false"){
                        obj.show_cover=false;
                    }
                    obj.cover_link=$(d).attr("data-url");
                    //暂时注销,下个版本启用
                    /*
                     if($(".frmTextarea").val() == ""){

                     $(".editorText").append(obj.content);
                     var editorText100 = $(".editorText").text().slice(0,100);
                     $(".frmTextarea").val(editorText100);
                     if(obj.ct_abstract==""){
                     obj.ct_abstract=editorText100;
                     }
                     }
                     */
                    content.push(obj);
                })

                if(arg_autoSave!="autoSave") {
                    //自动save不需要提示
                    var saveflag = false;
                    $.each(content,function(index,content){
                        if(content.title == ""){
                            saveflag = true;
                            //不显示弹窗,调用弹窗OK点击之后的功能
                            //$(".titleCheckDialog").removeClass("hidden");
                            setTimeout(function(){
                                $(".titleCheckDialog .btnBox .ok").click();
                            },1)
                            if(!content.title){
                                $("#wrapper").scrollTop(0);
                                $(window).scrollTop(0);
                            }
                            $("#jsAppmsgPreview .jsappmsgItem").eq(index).click();
                            return false;
                        }
                    })

                    if(saveflag){
                        return false;
                    }
                }
                var ajaxTimeOut = null;
                if(msg_id==""){
                    ajaxTimeOut = $.ajax({
                        type: "POST",
                        url: "/api/v1/official/article/message",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data:JSON.stringify(content),
                        success: function (cont, txtStatus, xhr) {
                            if(xhr.status==200){
                                //开启自动保存功能
                                autoSave=true;
                                msg_id=xhr.responseJSON.message.msg_id;
                                //给每篇文章赋值content_id
                                window.onbeforeunload=null;
                                pageLeaveTag=false;
                                $.each(xhr.responseJSON.content,function(i,d){
                                    $("#jsAppmsgPreview .jsappmsgItem").eq(i).attr("content_id",d.content_id);
                                })
                                if(arg_autoSave=="autoSave"){
                                    //自动save不需要提示
                                    //$.messageBox({message:"Save Successfully",level: "success",autoSave:true});
                                }else{
                                    $.messageBox({message:Lang.str("app_article_saveSuccess"),level: "success"});
                                }
                            }else if(xhr.status==207){
                                if(arg_autoSave=="autoSave"){
                                    //自动save不需要提示
                                    //$.messageBox({message:xhr.responseJSON.message,level: "error",autoSave:true});
                                }else{
                                    $.messageBox({message:Lang.str("system_AjaxError_500"),level: "error"});
                                }
                            }
                        }
                    });
                }else{
                    ajaxTimeOut = $.ajax({
                        type: "PUT",
                        url: "/api/v1/official/article/message/"+msg_id,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data:JSON.stringify(content),
                        success: function (cont, txtStatus, xhr) {
                            if(xhr.status==200){
                                window.onbeforeunload=null;
                                pageLeaveTag=false;
                                //开启自动保存功能
                                autoSave=true;
                                //给每篇文章赋值content_id
                                $.each(xhr.responseJSON.content,function(i,d){
                                    $("#jsAppmsgPreview .jsappmsgItem").eq(i).attr("content_id",d.content_id);
                                })
                                if(arg_autoSave=="autoSave"){
                                    //自动save不需要提示
                                    //$.messageBox({message:"Save Successfully",level: "success",autoSave:true});
                                }else{
                                    $.messageBox({message:Lang.str("app_article_saveSuccess"), level: "success"});
                                }
                            }else if(xhr.status==207){
                                if(arg_autoSave=="autoSave"){
                                    //自动save不需要提示
                                    //$.messageBox({message:xhr.responseJSON.message,level: "error",autoSave:true});
                                }else{
                                    $.messageBox({message:Lang.str("system_AjaxError_500"),level: "error"});
                                }
                            }
                        }
                    });
                }

                setTimeout(function(){
                    if (ajaxTimeOut.state()==='pending') {
                        ajaxTimeOut.abort();
                        $.messageBox({message: Lang.str("system_AjaxError_408"), level: "error"});
                    }
                },10000);
            }


            // save checkDialog
            $(".titleCheckDialog .btnBox .ok").click(function(){
                $(".broadcastDialog").addClass("hidden");
                $('.errorTip1').fadeOut();
                $('.errorTip2').fadeOut();
                $('.errorTip4').fadeOut();
                $('.errorTip').fadeIn();

            })

            // infoCheckDialog ok click
            $(".saveInfoCheckDialog .btnBox .ok").click(function(){
                $(".broadcastDialog").addClass("hidden");
                $("#jsAppmsgPreview .jsappmsgItem").each(function(i,d){
                    var obj={};
                    obj.content = decodeURIComponent($(d).attr("content"));
                    obj.show_cover = $(d).attr("show_cover");
                    obj.title = $(d).attr("data-title");
                    obj.cover_link=$(d).attr("data-url");
                    obj.has_orig_link=$(d).attr("has_orig_link");
                    obj.orig_link=$(d).attr("orig_link");
                    if(obj.title == ""||!(obj.content||(obj.show_cover==='true'&&obj.cover_link))||obj&&obj.cover_link == ""||(obj.has_orig_link==='true'&&!obj.orig_link)){
                        if(obj.content == ""){
                            if(obj.show_cover=="true"&&obj.cover_link!=""){
                                //内容为空,上传了图片,同时选中了show_cover复选框,那就认为是有内容
                                $(".errorTip2").fadeOut();
                            }else{
                                $(".simditor .simditor-body").focus();
                                $('.errorTip2').fadeIn();
                            }
                        }
                        if(obj.title == ""){
                            $(".title input").focus();
                            $('.errorTip').fadeIn();
                        }
                        if(obj.cover_link == ""){

                            $('.errorTip1').fadeIn();
                        }

                        if(obj.has_orig_link==='true'&&!obj.orig_link){
                            $("input.orig_link").removeClass("hidden").focus();
                            $('.errorTip4').fadeIn();
                        }
                        return false;
                    }
                })

            })

            var checkArticleParam = function(obj){
                if (!obj){
                    obj = {};
                }
                $(".broadcastDialog").addClass("hidden");
                if(obj.title == ""){
                    $(".title input").focus();
                    $('.errorTip').fadeIn();
                }
                if(!(obj.content||(obj.show_cover&&obj.cover_link))){
                    $(".simditor .simditor-body").focus();
                    $('.errorTip2').fadeIn();
                }
                if(obj.cover_link == ""){
                    $('.errorTip1').fadeIn();
                }
                if(obj.has_orig_link&&!obj.orig_link){
                    $("input.orig_link").removeClass("hidden").focus();
                    $('.errorTip4').fadeIn();
                }
                return false;
            };

            $(".articalEditorFooter .save").click(function(){
                if (!$(this).hasClass("disabled")) {
                    saveIt("");
                }
            })
            //每隔30秒自动保存
            intervalId = setInterval(function(){
                if(autoSave){
                    saveIt("autoSave");
                }
            },30000)
            var saveAndSendItContent=[];
            var saveAndSendItStart=function(){
                //当前的current保存一下值
                var content = editor.getValue();
                var ct_abstract = $(".frmTextarea").val();
                var title = $(".title input").val();
                var author = $(".author input").val();
                var has_orig_link=$(".has_orig_link").prop("checked");
                var orig_link=$(".orig_link").val();
                var show_cover=$(".show_cover").prop("checked");
                var content_id = $(".current").attr("content_id");
                $(".current").attr({"show_cover":show_cover,"orig_link":orig_link,"has_orig_link":has_orig_link,"content_id":content_id,"content":encodeURIComponent(content),"ct_abstract":ct_abstract,"data-title":title,"author":author});

                var content=[];
                $("#jsAppmsgPreview .jsappmsgItem").each(function(i,d){
                    var obj={};
                    obj.content = decodeURIComponent($(d).attr("content"));
                    obj.ct_abstract = $(d).attr("ct_abstract");
                    obj.content_id = $(d).attr("content_id");
                    obj.seqnum = i;
                    obj.title = $(d).attr("data-title");
                    obj.author = $(d).attr("author");
                    obj.has_orig_link=$(d).attr("has_orig_link");
                    if(obj.has_orig_link=="true"){
                        obj.has_orig_link=true;
                        obj.orig_link=$(d).attr("orig_link");
                    }else if(obj.has_orig_link=="false"){
                        obj.has_orig_link=false;
                        obj.orig_link="";
                    }
                    obj.show_cover=$(d).attr("show_cover");
                    if(obj.show_cover=="true"){
                        obj.show_cover=true;
                    }else if(obj.show_cover=="false"){
                        obj.show_cover=false;
                    }
                    obj.cover_link=$(d).attr("data-url");
                    content.push(obj);
                });

                for(var i = 0;i<content.length;i++){
                    var value = content[i];
                    if(!value.title||!value.cover_link||(value.has_orig_link&&!value.orig_link)
                        ||!(value.content||(value.show_cover&&value.cover_link))){
                        $(".saveAndSendDialog").addClass("hidden");
                        if(!value.title){
                            $(window).scrollTop(0);
                        }else if(!value.cover_link){
                            var top=$(".selectButton").offset().top;
                            $(window).scrollTop(top);
                        }
                        $("#jsAppmsgPreview .jsappmsgItem").eq(i).click();
                        return checkArticleParam(value);
                    }
                };
                saveAndSendItContent=content;
                $(".saveAndSendDialog").removeClass("hidden");
            }

            function saveAndSendItEnd(){
                var ajaxTimeOut = null;
                if(msg_id==""){
                    ajaxTimeOut = $.ajax({
                        type: "POST",
                        url: "/api/v1/official/article/message",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data:JSON.stringify(saveAndSendItContent),
                        success: function (cont, txtStatus, xhr) {
                            if(xhr.status==200){
                                window.onbeforeunload=null;
                                pageLeaveTag=false;
                                msg_id=xhr.responseJSON.message.msg_id;
                                //给每篇文章赋值content_id
                                $.each(xhr.responseJSON.content,function(i,d){
                                    $("#jsAppmsgPreview .jsappmsgItem").eq(i).attr("content_id",d.content_id);
                                })
                                $.ajax({
                                    type: "PUT",
                                    url: "/api/v1/official/article/sendgroup",
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    data:JSON.stringify({"msg_id":msg_id}),
                                    success: function (cont, txtStatus, xhr) {
                                        if(xhr.status==200){
                                            $.messageBox({message:Lang.str("app_broadcast_sendSuccess"),level: "success"});
                                            setTimeout(function(){
                                                location.href = "/broadcast"
                                            },1000)
                                        }else if(xhr.status==207){
                                            $.messageBox({message:Lang.str("system_AjaxError_500"),level: "error"});
                                        }
                                    }
                                })
                            }else if(xhr.status==207){
                                $.messageBox({message:Lang.str("system_AjaxError_500"),level: "error"});
                            }
                            $(".saveAndSendDialog .btnBox .ok").removeClass("disabled");
                            $(".saveAndSendDialog").addClass("hidden");
                        }
                    });
                }else{
                    ajaxTimeOut = $.ajax({
                        type: "PUT",
                        url: "/api/v1/official/article/message/"+msg_id,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data:JSON.stringify(saveAndSendItContent),
                        success: function (cont, txtStatus, xhr) {
                            if(xhr.status==200){
                                window.onbeforeunload=null;
                                pageLeaveTag=false;
                                //给每篇文章赋值content_id
                                $.each(xhr.responseJSON.content,function(i,d){
                                    $("#jsAppmsgPreview .jsappmsgItem").eq(i).attr("content_id",d.content_id);
                                })
                                $.ajax({
                                    type: "PUT",
                                    url: "/api/v1/official/article/sendgroup",
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    data:JSON.stringify({"msg_id":msg_id}),
                                    success: function (cont, txtStatus, xhr) {
                                        if(xhr.status==200){
                                            $.messageBox({message:Lang.str("app_broadcast_sendSuccess"),level: "success"});
                                            setTimeout(function(){
                                                location.href = "/broadcast"
                                            },1000)
                                        }else if(xhr.status==207){
                                            $.messageBox({message:Lang.str("system_AjaxError_500"),level: "error"});
                                        }
                                    }
                                })
                            }else if(xhr.status==207){
                                $.messageBox({message:Lang.str("system_AjaxError_500"),level: "error"});
                            }
                            $(".saveAndSendDialog .btnBox .ok").removeClass("disabled");
                            $(".saveAndSendDialog").addClass("hidden");
                        }
                    });
                }

                setTimeout(function(){
                    if (ajaxTimeOut.state()==='pending'){
                        ajaxTimeOut.abort();
                        $(".saveAndSendDialog .btnBox .ok").removeClass("disabled");
                        $.messageBox({message: Lang.str("system_AjaxError_408"), level: "error"});
                    }
                },10000);
            }

            $(".articalEditorFooter .saveAndSend").click(function(e){
                e.preventDefault();
                if (!$(this).hasClass("disabled")) {
                    saveAndSendItStart();
                }
            })
            // saveAndSendDialog ok click
            $(".saveAndSendDialog .btnBox .ok").click(function(e){
                e.preventDefault();
                if (!$(this).hasClass("disabled")) {
                    $(this).addClass("disabled");
                    saveAndSendItEnd();
                }
            })

            var changeFrmTextarea = function(obj){
                var target = $(obj);
                var text = target.val();
                var len=text.length;
                if(len>100){
                    var textCon=text.slice(0,100);
                    target.val(textCon);
                    len = 100;
                    $(".frmcounter").addClass("hasMaxLength");
                }else if(len==100){
                    $(".frmcounter").addClass("hasMaxLength");
                }else{
                    $(".frmcounter").removeClass("hasMaxLength");
                }
                $(".frmcounter .numtip").text(len);
            }
            $(".appmsgEdit").on("keyup keydown keypress",".frmTextarea",function(e){
                changeFrmTextarea(this);
            });

            $(".appmsgEdit").on("paste",".frmTextarea",function(e){
                var target = this;
                setTimeout(function(){
                    changeFrmTextarea(target);
                },2);
            });

            //上移
            $("#jsAppmsgPreview").on("click",".jsup",function(){
                var curItem=$(this).closest(".jsappmsgItem");
                var cruIndex=curItem.index();
                var len=$("#jsAppmsgPreview .jsappmsgItem").length-1;
                var prevItem=curItem.prev();
                var firstItemUrl = self.resetImagePath(curItem.attr("data-url"),216,118);
                var otherItemUrl = self.resetImagePath(prevItem.attr("data-url"),60,60);
                if(cruIndex==len && cruIndex!=1){//如果是最后一个上移
                    curItem.find(".jsdown").show();
                    prevItem.find(".jsdown").hide();
                }else if(cruIndex==1){//如果是第二个上移
                    //curItem.find(".firstAppmsgItem").show();
                    //curItem.find(".appmsgItem").hide();
                    curItem.find(".jsup").hide();
                    curItem.find(".jsdel").hide();
                    curItem.find(".jsdown").show();
                    //第二个上移,那第二个获得firstItem的Classname
                    $(".appmsgContent .appmsgItemWrap").removeClass("firstItem");
                    curItem.addClass("firstItem");
                    //prevItem.find(".firstAppmsgItem").hide();
                    //prevItem.find(".appmsgItem").show();
                    prevItem.find(".jsup").show();
                    prevItem.find(".jsdel").show();
                    prevItem.find(".jsdown").hide();
                    prevItem.find(".appmsgThumbWrap").css("backgroundImage","url("+otherItemUrl+")");
                    curItem.find(".appmsgThumbWrap").css("backgroundImage","url("+firstItemUrl+")");
                    if(len>=2){
                        prevItem.find(".jsdown").show();
                    }
                }
                prevItem.before(curItem);
            })
            //下移
            $("#jsAppmsgPreview").on("click",".jsdown",function(){
                var curItem=$(this).closest(".jsappmsgItem");
                var cruIndex=curItem.index();
                var len=$("#jsAppmsgPreview .jsappmsgItem").length-1;
                var nextItem=curItem.next();
                var firstItemUrl = self.resetImagePath(nextItem.attr("data-url"),216,118);
                var otherItemUrl = self.resetImagePath(curItem.attr("data-url"),60,60);
                if(cruIndex==0){//如果是第一个下移
                    if(len==0){
                        //当前有且只有一项 那什么都不用做
                        return false;
                    }
                    //curItem.find(".firstAppmsgItem").hide();
                    //curItem.find(".appmsgItem").show();
                    curItem.find(".jsup").show();
                    curItem.find(".jsdel").show();
                    curItem.find(".jsdown").show();
                    //第一个下移,那第二个获得firstItem的Classname
                    $(".appmsgContent .appmsgItemWrap").removeClass("firstItem");
                    nextItem.addClass("firstItem");

                    // nextItem.find(".firstAppmsgItem").show();
                    //nextItem.find(".appmsgItem").hide();
                    nextItem.find(".jsup").hide();
                    nextItem.find(".jsdel").hide();
                    nextItem.find(".jsdown").show();
                    curItem.find(".appmsgThumbWrap").css("backgroundImage","url("+otherItemUrl+")");
                    nextItem.find(".appmsgThumbWrap").css("backgroundImage","url("+firstItemUrl+")");

                    if(len==1){
                        curItem.find(".jsdown").hide();
                    }
                }else if(cruIndex==(len-1)){//如果是倒数第二个下移
                    curItem.find(".jsdown").hide();
                    nextItem.find(".jsdown").show();
                }
                nextItem.after(curItem);
            })
            //删除
            $("#jsAppmsgPreview").on("click",".jsdel",function(e){
                var content = editor.getValue();
                var ct_abstract = $(".frmTextarea").val();
                var title = $(".title input").val();
                var author = $(".author input").val();
                var has_orig_link=$(".has_orig_link").prop("checked");
                var orig_link=$(".orig_link").val();
                var show_cover=$(".show_cover").prop("checked");
                $(".jsappmsgItem.current").attr({"show_cover":show_cover,"orig_link":orig_link,"has_orig_link":has_orig_link,"content":encodeURIComponent(content),"ct_abstract":ct_abstract,"data-title":title,"author":author});

                var jsappmsgItem  =$(this).closest(".jsappmsgItem");
                var cover_link=jsappmsgItem.attr("data-url");;
                jsappmsgItem.addClass("deleteFlag");

                if(jsappmsgItem.attr("data-title")||jsappmsgItem.attr("content")||cover_link){
                    $(".deleteConfirm").removeClass("hidden");
                }
                else {
                    var curItem=jsappmsgItem;
                    var cruIndex=curItem.index();
                    var len=$("#jsAppmsgPreview .jsappmsgItem").length-1;

                    if(cruIndex==len){
                        //删除的是最后一个
                        curItem.prev().find(".jsdown").hide();
                    }
                    //删除项有current,让上一项获取current
                    if(curItem.hasClass("current")){
                        curItem.prev().click();
                    }
                    curItem.remove();
                    var newLen=$("#jsAppmsgPreview .jsappmsgItem").length;
                    if (newLen<=7){
                        $("#jsaddAppmsg").removeClass("hidden");
                    }
                    else{
                        $("#jsaddAppmsg").addClass("hidden");
                    }
                }
                return false;

            })


            // 删除取消按钮
            $(".deleteConfirm .btnBox .cancel,.deleteConfirm .dialogHead .close").click(function(){
                $("#jsAppmsgPreview .jsappmsgItem").removeClass("deleteFlag");
            });

            //删除确定按钮
            $(".deleteConfirm .btnBox .ok").click(function(){

                var curItem =$("#jsAppmsgPreview").find(".deleteFlag");
                var cruIndex=curItem.index();
                var len=$("#jsAppmsgPreview .jsappmsgItem").length-1;
                if(cruIndex==len){
                    //删除的是最后一个
                    curItem.prev().find(".jsdown").hide();
                }
                //删除项有current,让上一项获取current
                if(curItem.hasClass("current")){
                    curItem.prev().click();
                }
                curItem.remove();
                var newLen=$("#jsAppmsgPreview .jsappmsgItem").length;
                if (newLen<=7){
                    $("#jsaddAppmsg").removeClass("hidden");
                }
                else{
                    $("#jsaddAppmsg").addClass("hidden");
                }
                $(".deleteConfirm").addClass("hidden");
            })
            //点击增加class:current
            $("#jsAppmsgPreview").on("click",".jsappmsgItem",function(e){
                e.preventDefault();
                $('input.imgSelect').val('');
                var currentNode = $(this);
                var content = editor.getValue();
                var ct_abstract = $(".frmTextarea").val();
                var title = $(".title input").val();
                var author = $(".author input").val();
                var has_orig_link=$(".has_orig_link").prop("checked");
                var orig_link=$(".orig_link").val();
                var show_cover=$(".show_cover").prop("checked");
                $(".appmsgItemWrap.current").attr({"show_cover":show_cover,"orig_link":orig_link,"has_orig_link":has_orig_link,"content":encodeURIComponent(content),"ct_abstract":ct_abstract,"data-title":title,"author":author});
                currentNode.addClass("current").siblings(".jsappmsgItem").removeClass("current");
                var newContent=currentNode.attr("content");
                var newCt_abstract=currentNode.attr("ct_abstract");
                var newTitle = currentNode.attr("data-title");
                var newAuthor = currentNode.attr("author");
                var has_orig_link=currentNode.attr("has_orig_link");
                var orig_link=currentNode.attr("orig_link");
                var show_cover=currentNode.attr("show_cover");
                var cover_link=currentNode.attr("data-url");
                $(".title input").val(newTitle);
                $(".author input").val(newAuthor);
                editor.setValue(decodeURIComponent(newContent));
                $(".frmTextarea").val(newCt_abstract);
                //重新设置摘要的字数,如果字数不足100,去掉.frmcounter的hasMaxLength类,等于100,加上.frmcounter的hasMaxLength类
                var textareaValLen=newCt_abstract.length;
                $(".numtip").text(textareaValLen);
                if(textareaValLen<100){
                    $(".appmsgEdit .abstractTextarea .frmcounter").removeClass("hasMaxLength");
                }else if(textareaValLen===100){
                    $(".appmsgEdit .abstractTextarea .frmcounter").addClass("hasMaxLength");
                }
                //第一篇文章imgSize为900*500,其他为240*240
                if(currentNode.hasClass("firstItem")){
                    $("#imgSize").text("900*500");
                }else{
                    $("#imgSize").text("240*240");
                }

                //文章切换时错误提示都隐藏
                $(".errorTip").hide();
                $(".errorTip1").hide();
                $(".errorTip2").hide();
                $(".errorTip4").hide();

                $(".appmsgEditItem>.title>.numberBox").addClass("hidden");
                $(".appmsgEditItem>.author>.numberBox").addClass("hidden");
                if(has_orig_link=="true"){
                    $(".has_orig_link").prop("checked",true);
                    $(".orig_link").val(orig_link).removeClass("hidden");
                }else{
                    $(".has_orig_link").prop("checked",false);
                    $(".orig_link").val(orig_link).addClass("hidden");
                }

                if(show_cover=="true"){
                    $(".show_cover").prop("checked",true);
                }else{
                    $(".show_cover").prop("checked",false);
                }

                //指定上传图片的缩略图,先制空,如果有图片就显示

                $(".upimgBox img").addClass("defaultImage").attr("src",self.emptyImage);
                $(".upimgBox").addClass("hidden");
                if(cover_link){
                    $(".upimgBox img").removeClass("defaultImage").attr("src",self.resetImagePath(cover_link,72,72));
                    $(".upimgBox").removeClass("hidden");
                }
            })

            $(".appmsgEditorContainerBd").on("click",".appmsgAdd",function(e){
                var target = $(e.currentTarget);
                var lastItem=$(".jsappmsgItem").last();
                var lastIdNum=lastItem.index();
                if(lastIdNum>6){
                    return false;
                }
                var newItem=lastItem.clone().removeClass("current").removeClass("firstItem");
                //设置新item的各种参数
                newItem.attr({"has_orig_link":"false","orig_link":"","show_cover":"true","id":"","content_id":"","author":"","data-title":"","content":"","ct_abstract":"","data-url":""});
                newItem.removeAttr("data-reactid").find("div").removeAttr("data-reactid");
                newItem.find("h4").removeAttr("data-reactid");
                newItem.find("i").removeAttr("data-reactid");
                newItem.find("a").removeAttr("data-reactid");
                //newItem.find(".firstAppmsgItem").attr("title","第"+(newItemNum+1)+"篇图文").hide();
                newItem.find(".appmsgThumbWrap").css("backgroundImage","");
                newItem.find(".appmsgItem").show();
                newItem.find(".appmsgTitle").text("");
                newItem.find(".default").show();
                newItem.find(".jsup").show();
                newItem.find(".jsdel").show();
                newItem.find(".jsdown").hide();
                //设置老item的各种参数
                lastItem.find(".jsdown").show();
                //插入新的item
                lastItem.after(newItem);
                newItem.click();
                if (newItem.index()>=7){
                    target.addClass("hidden");
                }
                else{
                    target.removeClass("hidden");
                }
            })
            var saveAndPreviewIt=function(currentNode){
                //当前的current保存一下值
                var content = editor.getValue();
                var ct_abstract = $(".frmTextarea").val();
                var title = $(".title input").val();
                var author = $(".author input").val();
                var has_orig_link=$(".has_orig_link").prop("checked");
                var orig_link=$(".orig_link").val();
                var show_cover=$(".show_cover").prop("checked");
                var content_id = $(".current").attr("content_id");
                $(".current").attr({"show_cover":show_cover,"orig_link":orig_link,"has_orig_link":has_orig_link,"content_id":content_id,"content":encodeURIComponent(content),"ct_abstract":ct_abstract,"data-title":title,"author":author});

                var contentArray=[];
                $("#jsAppmsgPreview .jsappmsgItem").each(function(i,d){
                    var obj={};
                    obj.content = decodeURIComponent($(d).attr("content"));
                    obj.ct_abstract = $(d).attr("ct_abstract");
                    obj.content_id = $(d).attr("content_id");
                    obj.seqnum = i;
                    obj.title = $(d).attr("data-title");
                    obj.author = $(d).attr("author");
                    obj.has_orig_link=$(d).attr("has_orig_link");
                    if(obj.has_orig_link=="true"){
                        obj.has_orig_link=true;
                        obj.orig_link=$(d).attr("orig_link");
                    }else if(obj.has_orig_link=="false"){
                        obj.has_orig_link=false;
                        obj.orig_link="";
                    }

                    obj.show_cover=$(d).attr("show_cover");
                    if(obj.show_cover=="true"){
                        obj.show_cover=true;
                    }else if(obj.show_cover=="false"){
                        obj.show_cover=false;
                    }
                    obj.cover_link=$(d).attr("data-url");
                    contentArray.push(obj);
                })

                for(var i = 0;i<contentArray.length;i++){
                    var content = contentArray[i];
                    if(!content.title||!content.cover_link||(content.has_orig_link&&!content.orig_link)
                        ||!(content.content||(content.show_cover&&content.cover_link))){
                        //不显示弹窗,调用弹窗OK点击之后的功能
                        //$(".saveInfoCheckDialog").removeClass("hidden");
                        if(!content.title){
                            $(window).scrollTop(0);
                        }else if(!content.cover_link){
                            var top=$(".selectButton").offset().top;
                            $(window).scrollTop(top);
                        }
                        $("#jsAppmsgPreview .jsappmsgItem").eq(i).click();
                        return checkArticleParam(content);
                    }
                }
                var ajaxTimeOut = null;
                if(msg_id==""){
                    ajaxTimeOut = $.ajax({
                        type: "POST",
                        url: "/api/v1/official/article/message",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data:JSON.stringify(contentArray),
                        success: function (cont, txtStatus, xhr) {
                            if(xhr.status==200){
                                window.onbeforeunload=null;
                                pageLeaveTag=false;
                                msg_id=xhr.responseJSON.message.msg_id;
                                //给每篇文章赋值content_id
                                $.each(xhr.responseJSON.content,function(i,d){
                                    $("#jsAppmsgPreview .jsappmsgItem").eq(i).attr("content_id",d.content_id);
                                })
                                $.ajax({
                                    url: '/api/v1/official/account',
                                    type: 'GET',
                                    contentType: 'application/json; charset=utf-8',
                                    dataType: "json",
                                    async: true,
                                    success: function (cont, txtStatus, xhr) {
                                        if (xhr.status != 200) {
                                            return false;
                                        }
                                        //设置previewDialog
                                        $(".areaNumber").val(xhr.responseJSON.countrycode);
                                        $(".previewDialog").removeClass("hidden");
                                        $(".previewTxt").focus();
                                    }
                                })
                            }else if(xhr.status==207){
                                $.messageBox({message:Lang.str("system_AjaxError_500"),level: "error"});
                            }
                        }
                    });
                }else{
                    ajaxTimeOut = $.ajax({
                        type: "PUT",
                        url: "/api/v1/official/article/message/"+msg_id,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data:JSON.stringify(contentArray),
                        success: function (cont, txtStatus, xhr) {
                            if(xhr.status==200){
                                window.onbeforeunload=null;
                                pageLeaveTag=false;
                                //给每篇文章赋值content_id
                                $.each(xhr.responseJSON.content,function(i,d){
                                    $("#jsAppmsgPreview .jsappmsgItem").eq(i).attr("content_id",d.content_id);
                                })
                                $.ajax({
                                    url: '/api/v1/official/account',
                                    type: 'GET',
                                    contentType: 'application/json; charset=utf-8',
                                    dataType: "json",
                                    async: true,
                                    success: function (cont, txtStatus, xhr) {
                                        if (xhr.status != 200) {
                                            return false;
                                        }
                                        //设置previewDialog
                                        $(".areaNumber").val(xhr.responseJSON.countrycode);
                                        $(".previewDialog").removeClass("hidden");
                                        $(".previewTxt").focus();
                                    }
                                })
                            }else if(xhr.status==207){
                                $.messageBox({message:Lang.str("system_AjaxError_500"),level: "error"});
                            }
                        }
                    });
                }
                setTimeout(function(){
                    if (ajaxTimeOut.state()==='pending'){
                        ajaxTimeOut.abort();
                        $.messageBox({message: Lang.str("system_AjaxError_408"), level: "error"});
                    }
                },10000);
            }

            //previewDialog
            $(".preview").click(function(e){
                var currentNode = $(this);
                $(".previewCon .tip").addClass("hidden");
                if (!currentNode.hasClass("disabled")) {
                    saveAndPreviewIt(currentNode);
                }
                return false;
            })
            //close
            $(".dialogHead .close").click(function(){
                $(".broadcastDialog").addClass("hidden");
            })
            // cancel click
            $(".dialogfoot .btnBox .cancel").click(function(){
                $(".broadcastDialog").addClass("hidden");
            })
            // previewDialog ok click
            $(".previewDialog .btnBox .ok").click(function(){
                var currentNode = $(this);
                if (currentNode.hasClass("disabled")){
                    return false;
                }
                if(msg_id==""){
                    $.messageBox({message:"Save First!",level: "error"});
                    return false;
                }
                var areaNumber=$(".areaNumber").val();
                var previewTxt=$(".previewTxt").val();
                if(!(areaNumber&&previewTxt&&!isNaN(areaNumber)&&!isNaN(previewTxt))){
                    $(".previewCon .tip").addClass("hidden");
                    $(".previewCon .notCorrect").removeClass("hidden");
                    return false;
                }
                var touid=areaNumber+previewTxt;
                currentNode.addClass("disabled");
                var ajaxTimeOut = $.ajax({
                    type: "PUT",
                    url: "/api/v1/official/article/sendsingle",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data:JSON.stringify({"msg_id":msg_id,"touid":touid}),
                    success: function (cont, txtStatus, xhr) {
                        currentNode.removeClass("disabled");
                        if(xhr.status==200){
                            //开启自动保存功能
                            autoSave=true;
                            $.messageBox({message:Lang.str("app_broadcast_previewHasSent"),level: "success"});
                            $(".previewDialog").addClass("hidden");
                        }else if(xhr.status==207){
                            $(".previewCon .tip").addClass("hidden");
                            $(".previewCon .notFollow").removeClass("hidden");
                        }
                    }
                });
                setTimeout(function() {
                    if (ajaxTimeOut.state() === 'pending') {
                        ajaxTimeOut.abort();
                        currentNode.removeClass("disabled");
                        $(".previewCon .tip").addClass("hidden");
                        $(".previewCon .notFollow").removeClass("hidden");
                    }
                },10000);
            })


            //校验必填项
            $('.errorTip1').hide();


            $('.errorTip').hide();
            $(".appmsgEdit .title input").on("keydown keyup",function(event){
                var data = $(event.target).val();
                data = $.trim(data);
                pageLeaveTag = !msg_id&&data.length>0;
                if(data.length > 0) {
                    $('.errorTip').fadeOut();
                    //设置当前选中项的title
                    $(".jsappmsgItem.current .appmsgTitle").text(data);
                }
            });

            $('.errorTip2').hide();
            $(".simditor-body").on("blur keyup",function(event){

                var data = $('.simditor-body').text();
                data = $.trim(data);
                if(data.length < 1) {
                    //$('.errorTip2').fadeIn();
                    //event.preventDefault();
                } else {
                    $('.errorTip2').fadeOut();

                }
            });
            //删除上传图片
            $(".upimgBox .close").click(function(){
                $(".upimgBox img").addClass("defaultImage").attr("src",self.emptyImage);
                $(".upimgBox").addClass("hidden");
                $('input.imgSelect').val('');
                $('.jsappmsgItem.current').attr("data-url","");
                $('.jsappmsgItem.current .jsappmsgThumb').css("backgroundImage", "none");
                $(".jsappmsgItem.current .default").css("display","block");
                //全局设为true，添加跳转功能
                pageLeaveTag=true;
                window.onbeforeunload=function(){
                    return "You have not saved the modifications. Are you sure you want to leave this page?";
                }
            })
            //点击跳转到其他页面,弹出提示,点击确定就跳转,点击取消就不跳转
            window.onbeforeunload=null;
            $(".appmsgEditItem .author input, .appmsgEditItem .title input,.simditor .simditor-body,.appmsgEdit .show_cover,.appmsgEdit .frmTextarea,.appmsgEdit .has_orig_link,.appmsgEdit .orig_link").on('change keydown',function(){
                pageLeaveTag=true;
                window.onbeforeunload=function(){
                    return "You have not saved the modifications. Are you sure you want to leave this page?";
                }
            })
            var editorFun = function(){
                editor.on('valuechanged', function(){
                    pageLeaveTag=true;
                    window.onbeforeunload=function(){
                        return "You have not saved the modifications. Are you sure you want to leave this page?";
                    }
                })
            }

            $(".appmsgEditItem .author input").focus(function(){

                $('.appmsgEditItem .author  em').css('color',"#000");
            }).blur(function(){

                $('.appmsgEditItem .author  em').css('color',"#b4b5b7");
            });

            $(".appmsgEditItem .title input").focus(function(){

                $('.appmsgEditItem .title  em').css('color',"#000");
            }).blur(function(){

                $('.appmsgEditItem .title  em').css('color',"#b4b5b7");
            });
            //添加maxLength属性
            $(".appmsgEditItem .title input").attr("maxLength","64");
            $(".appmsgEditItem .author input").attr("maxLength","16");

        })
    }

    uploadAvatar(event) {
        var self= this;
        let fileToLoad = event.target.files[0];
        var fileReader = new FileReader();
        var currentNode = $('.jsappmsgItem.current');
        var currentIndex= currentNode.index();
        var maxFileSize = 5*1024*1024; //限制最大上传5M大的图片
        if (!fileToLoad){
            return false;
        }
        if (fileToLoad.size>maxFileSize){
            $.messageBox({message:Lang.str('app_setting_AccountInfo_Edit_PotoSize'),level: "error"});
            return false;
        }
        fileReader.onload = function(fileLoadedEvent)
        {
            $(".articalEditorFooter>a").addClass("disabled");
            $(".upimgBox").removeClass("hidden");
            $(".upimgBox .progressBarLine").removeClass("hidden");
            //刚上传图片时隐藏删除按钮,上传成功在展示
            $(".upimgBox .close").addClass("hidden");
            let content = fileLoadedEvent.target.result;
            self.xhr = new XMLHttpRequest();
            var xhr = self.xhr;
            var uploadStart = function(){
            }
            xhr.addEventListener("loadstart", uploadStart, false); // 处理上传完成
            var successfulCallBack = function(e){
                if(e.target.status != 200){
                    alert("Update Avatar Fail")
                }else {
                    var resp = JSON.parse(e.target.responseText);
                    var newUrl = resp.data.url;
                    var postImage = '';
                    if (currentNode.hasClass("firstItem")){
                        postImage = self.resetImagePath(newUrl,216,118);
                    }
                    else{
                        postImage = self.resetImagePath(newUrl,78,78);
                    }
                    currentNode.attr("data-url",newUrl);
                    currentNode.find('.jsappmsgThumb').css("background-image", "url("+postImage+")");
                    currentNode.find(".default").css("display","none");
                    var newItemIndex = $('.jsappmsgItem.current').index();
                    //指定上传图片的缩略图
                    if(newUrl.length>0){
                        if (currentIndex===newItemIndex){
                            $(".upimgBox img").removeClass("defaultImage").attr("src",self.resetImagePath(newUrl,72,72));
                            $(".upimgBox").removeClass("hidden");
                        }
                        //刚上传图片时隐藏删除按钮,上传成功在展示
                        $(".upimgBox .close").removeClass("hidden");
                        $(".upimgBox .progressBarLine").addClass("hidden");
                        $(".upimgBox .passedProgress").width(0);
                        $('.errorTip1').hide();
                        //全局设为true，添加跳转功能
                        pageLeaveTag=true;
                        window.onbeforeunload=function(){
                            return "You have not saved the modifications. Are you sure you want to leave this page?";
                        }
                    }
                }
                $(".articalEditorFooter>a").removeClass("disabled");
            }
            xhr.addEventListener("load", successfulCallBack, false); // 处理上传完成

            var failCallBack = function(){
            }

            xhr.addEventListener("error", failCallBack, false); // 处理上传失败
            xhr.addEventListener("abort", failCallBack, false); // 处理取消上传
            var formData = new FormData();
            formData.append('file', fileToLoad);
            xhr.upload.onprogress = function(evt) {
                var loaded = evt.loaded;
                var tot = evt.total;
                var per = Math.floor(100 * loaded / tot); //已经上传的百分比
                $(".upimgBox .passedProgress").css("width",per+"%");
            };
            xhr.open('post', '/upload/file5/upload/official.json?type=image');
            xhr.send(formData);
        };
        fileReader.readAsDataURL(fileToLoad);
    }

    uploadAvatarClick(){
        $("input.imgSelect").val('');
    }

    serviceLimitKeyup(e){
        var obj = e.target;
        obj.value=obj.value.replace(/\D/gi,"");
    }

    cancelUploadEvent(e){
        var self = this;
        self.xhr.abort();
        $("input.imgSelect").val("");
        $(".upimgBox .passedProgress").width(0);
        $(".upimgBox .close").removeClass("hidden");
        $(".upimgBox .progressBarLine").addClass("hidden");
        $(".articalEditorFooter>a").removeClass("disabled");
        if ($(".upimgBox img").hasClass("defaultImage")){
            $(".upimgBox").addClass("hidden");
        }
    }

    controlDisplayNum(e){
        var target = $(e.target);
        var maxLength = parseInt(target.attr("maxlength"));
        var numBox = target.nextAll(".numberBox")
        var now = numBox.find(".now");
        var val = target.val();
        if (e.type==='blur'){
            numBox.addClass("hidden");
        }
        else{
            numBox.removeClass("hidden");
            val.length===maxLength?numBox.addClass("hasMaxLength"):numBox.removeClass("hasMaxLength");
        }
        now.text(val.length);
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
        return (
            <div style={{height:"100%"}}>
                <div id="broadcast">
                    <header className="broadcastHeader">
                        <div className="broadcastHeaderWrp">
                            <a className="goBroadcast" href="/broadcast">{Lang.str("app_broadcast_back")}</a>
                            <f>|</f>
                            <span>{Lang.str("app_broadcast_imageTextBroadcast")}</span>
                        </div>
                    </header>

                    <div className="appmsgEditorContainer">
                        <div className="appmsgEditorContainerHd">
                            <h4 className="appmsgEditorContainerTitle">{Lang.str("app_broadcast_broadcastPreview")}</h4>
                        </div>

                        <div className="appmsgEditorContainerBd">
                            <div className="appmsg multi editing">
                                <div id="jsAppmsgPreview" className="appmsgContent">
                                    <div show_cover="true" has_orig_link="false" orig_link="" content_id="" author="" data-url="" data-title="" content="" ct_abstract="" className="jsappmsgItem appmsgItemWrap hasThumb firstItem current">
                                        <div className="appmsgItem clearfix">
                                            <div className="appmsgThumbWrap jsappmsgThumb"  >
                                                <div className="appmsgThumb default" style={{display:"block;"}}>
                                                    <i className="iconAppmsgThumbSmall"></i>
                                                </div>
                                            </div>
                                            <h4 className="appmsgTitle js_appmsg_title"></h4>
                                            <div className="appmsgEditMask">
                                                <a onclick="return false;" className="icon20Common sortUpWhite   jsup" data-id="1" href="javascript:;"></a>
                                                <a onclick="return false;" className="icon20Common sortDownWhite jsdown" data-id="0" href="javascript:;"></a>
                                                <a onclick="return false;" className="icon20Common delMediaWhite jsdel" data-id="0" href="javascript:;"></a>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                            <a onclick="return false;" title="" className="createAccessPrimary appmsgAdd" id="jsaddAppmsg" href="javascript:void(0);">
                                <i className="icon35Common addGray"></i>
                            </a>
                        </div>

                    </div>

                    <div className="appmsgEdit">
                        <div className="appmsgEditItem gapLeft">
                            <div className="title">
                                <input  type="text" placeholder={Lang.str('app_broadcast_edit_title')} maxlength="64" onFocus={this.controlDisplayNum.bind(this)} onBlur={this.controlDisplayNum.bind(this)} onKeyup={this.controlDisplayNum.bind(this)} onChange={this.controlDisplayNum.bind(this)}/>
                                <span className="errorTip">{Lang.str("app_broadcast_fieldNotEmpty")}</span>
                                <div className="numberBox hidden"><span className="now">0</span><span className="total">/64</span></div>
                            </div>
                            <div className="author">
                                <input  type="text" maxlength="16" placeholder={Lang.str('app_broadcast_edit_author')} onFocus={this.controlDisplayNum.bind(this)} onBlur={this.controlDisplayNum.bind(this)} onKeyup={this.controlDisplayNum.bind(this)} onChange={this.controlDisplayNum.bind(this)}/>
                                <div className="numberBox hidden"><span className="now">0</span><span className="total">/16</span></div>
                            </div>
                            <div id="simditorBox" ><textarea id="simditor" ref='textarea' /></div>
                            <div className="clearfix errorTip2Box"><span className="errorTip2">{Lang.str("app_broadcast_fieldNotEmpty")}</span></div>
                            <div className="orignalLink">
                                <label>
                                    <input  className="has_orig_link" type="checkbox" />
                                    <span>{Lang.str("app_broadcast_sourceLink")}</span>
                                </label>
                                <input type="text" className="orig_link hidden" maxlength="256"/>
                                <span className="errorTip4">{Lang.str("app_broadcast_fieldNotEmpty")}</span>
                            </div>
                            <strong className="noMargin">{Lang.str("app_broadcast_coverImage")}</strong>
                            <p>{Lang.str("app_broadcast_suggestedImageSize")} <span id="imgSize">900*500</span></p>
                            <a className="selectButton">
                                {Lang.str("app_broadcast_uploadImage")}
                                <input className="imgSelect" type="file" name="SelectImages"  accept="image/*" onChange={this.uploadAvatar.bind(this)} onClick={this.uploadAvatarClick.bind(this)}/>
                                <span className="errorTip1">{Lang.str("app_broadcast_fieldNotEmpty")}</span>
                            </a>
                            <div className="upimgBox hidden">
                                <img src={this.emptyImage} className="defaultImage"/>
                                <a className="close" href="javascript:;"></a>
                                <div className="progressBarLine hidden">
                                    <div className="progressBar"><div className="passedProgress"></div></div>
                                    <div className="cancelUpload" onClick={this.cancelUploadEvent.bind(this)}></div>
                                </div>
                            </div>
                            <label>
                                <input className="show_cover" type="checkbox"/>
                                <span>{Lang.str("app_broadcast_showCoverInArticle")}</span>
                            </label>
                            <div></div>
                            <strong>{Lang.str("app_broadcast_abstract")}</strong>
                            <p className="hidden">{Lang.str("app_broadcast_sourceLink")}</p>
                        <span className="abstractTextarea">
                            <textarea id="test" className="frmTextarea" name="digest" maxlength="100"></textarea>
                            <em className="frmcounter"><span className="numtip">0</span>/100</em>
                        </span>
                        </div>
                    </div>

                    <footer>
                        <div className="articalEditorFooter">
                            <a className="saveAndSend current">{Lang.str("app_broadcast_saveAndSend")}</a>
                            <a className="preview">{Lang.str("app_broadcast_preview")}</a>
                            <a className="save">{Lang.str("app_broadcast_save")}</a>
                        </div>
                        <div className="hidden editorText">
                        </div>
                    </footer>
                </div>

                <div className="broadcastDialog deactivateDialog dialogShadow deleteConfirm hidden">
                    <div className="dialogWrap">
                        <div className="dialogHead">
                            <h2>{Lang.str("app_broadcast_warning")}</h2>
                            <a className="close" href="javascript:;"></a>
                        </div>
                        <div className="dialogContent">
                            <p>{Lang.str("app_broadcast_removeArticleMsg")}</p>
                        </div>
                        <div className="dialogfoot">
                            <div className="clearfix btnBox">
                                <a className="ok active" href="javascript:;">{Lang.str("app_broadcast_ok")}</a>
                                <a className="cancel" href="javascript:;">{Lang.str("app_broadcast_cancel")}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="broadcastDialog deactivateDialog dialogShadow titleCheckDialog hidden">
                    <div className="dialogWrap">
                        <div className="dialogHead">
                            <h2>{Lang.str("app_broadcast_warning")}</h2>
                            <a className="close" href="javascript:;"></a>
                        </div>
                        <div className="dialogContent">
                            <p>The information you entered is not complete.</p>
                        </div>
                        <div className="dialogfoot">
                            <div className="clearfix btnBox">
                                <a className="ok active" href="javascript:;">{Lang.str("app_broadcast_ok")}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="broadcastDialog deactivateDialog  saveInfoCheckDialog dialogShadow hidden">
                    <div className="dialogWrap">
                        <div className="dialogHead">
                            <h2>{Lang.str("app_broadcast_warning")}</h2>
                            <a className="close" href="javascript:;"></a>
                        </div>
                        <div className="dialogContent">
                            <p>The information you entered is not complete.</p>
                        </div>
                        <div className="dialogfoot">
                            <div className="clearfix btnBox">
                                <a className="ok active" href="javascript:;">{Lang.str("app_broadcast_ok")}</a>
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
                                    <input placeholder={Lang.str("app_broadcast_enterMobilePhoneNumMsg")} onKeyUp={this.serviceLimitKeyup.bind(this)} onInput={this.serviceLimitKeyup.bind(this)} className="previewTxt" type="text" />
                                </div>
                                <div>
                                    <p className="tip hidden notCorrect">*{Lang.str("app_broadcast_incorrentPhoneNumMsg")}</p>
                                    <p className="tip hidden notFollow">*{Lang.str("app_broadcast_notFollowPublicAccount")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="dialogfoot">
                            <div className="clearfix btnBox">
                                <a className="ok active" href="javascript:;">{Lang.str("app_broadcast_ok")}</a>
                                <a className="cancel" href="javascript:;">{Lang.str("app_broadcast_cancel")}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="broadcastDialog deactivateDialog saveAndSendDialog dialogShadow hidden">
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
            </div>
        );
    }
}

export default ArticalEditor;

