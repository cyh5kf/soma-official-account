
export class QuickReplyUtil {

    static idleCall(cbsuccess) {
        $.ajax({
            url: '/api/v1/cs/agent/info',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static getInitialCategory(tag, cbsuccess) {
        $.ajax({
            url: '/api/v1/cs/quickreply/'+tag+'category',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }

    static getAllQuickList(successHandler){
        $.ajax({
            url: "/api/v1/cs/quickreply/listfullreplys",
            type: 'GET',
            dataType: 'json',
            async: true,
            success: successHandler
        });
    }

    static listCategoryReplys(tag, category_id, cbsuccess) {
        $.ajax({
            url: '/api/v1/cs/quickreply/'+tag+'category/'+category_id,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static newCategoryCall(name, tag, cbsuccess) {
        var strJson = {
            "name": name
        }
        $.ajax({
            url: '/api/v1/cs/quickreply/'+tag+'category',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(strJson),
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static renameCategoryCall(category_id, tag, name, cbsuccess) {
        var strJson = {
            "name": name
        }
        $.ajax({
            url: '/api/v1/cs/quickreply/'+tag+'category/'+category_id,
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(strJson),
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static importTemplateCall(category_id, tag, filename,cbsuccess) {
        var strJson = {
            "name": name,
            "content":content,
            "category_id":category_id
        }
        $.ajax({
            url: '/api/v1/cs/quickreply/'+tag+'import',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(strJson),
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static addReplyCall(category_id, tag, name, content, cbsuccess) {
        var strJson = {
            "name": name,
            "content":content,
            "category_id":category_id
        }
        $.ajax({
            url: '/api/v1/cs/quickreply/'+tag+'reply',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(strJson),
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static modifyReplyCall(category_id, tag, name, content, reply_id, cbsuccess) {
        var strJson = {
            "name": name,
            "content":content,
            "category_id":category_id
        }
        $.ajax({
            url: '/api/v1/cs/quickreply/'+tag+'reply/'+reply_id,
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(strJson),
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static deleteReplyCall(tag, reply_id, cbsuccess) {
        $.ajax({
            url: '/api/v1/cs/quickreply/'+tag+'reply/'+reply_id,
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static deleteCategoryCall(tag, category_id, cbsuccess) {
        $.ajax({
            url: '/api/v1/cs/quickreply/'+tag+'category/'+category_id,
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
};
