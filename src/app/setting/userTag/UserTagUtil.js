
export class UserTagUtil {
    static getTagListCall(cbsuccess) {
        $.ajax({
            url: '/api/v1/cs/user_tag',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static addTagCall(tagname, tagcolor, cbsuccess) {
        var strJson = {
            "name": tagname,
            "color": tagcolor
        }
        $.ajax({
            url: '/api/v1/cs/user_tag',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(strJson),
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static modifyTagCall(tagid, tagname, tagcolor, cbsuccess) {
        var strJson = {
            "name": tagname,
            "color": tagcolor
        }
        $.ajax({
            url: '/api/v1/cs/user_tag/'+tagid,
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
    static deleteTagCall(tagid, cbsuccess) {
        $.ajax({
            url: '/api/v1/cs/user_tag/'+tagid,
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
    static getTagUsageCall(tagid, cbsuccess) {
        $.ajax({
            url: '/api/v1/cs/user_tag/usage/'+tagid,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        })
    }
};
