
export class PersonalInfoUtil {
    static getInfoCall(cbsuccess) {
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
    static modifyAvatarCall(avatar, cbsuccess) {
        var strJson = {
            "avatar": avatar
        }
        $.ajax({
            url: '/api/v1/cs/personalinfo/avatar',
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
    static modifyEmailCall(email, cbsuccess) {
        var strJson = {
            "email": email
        }
        $.ajax({
            url: '/api/v1/cs/personalinfo/email',
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
    static modifyCsidCall(csid, cbsuccess) {
        var strJson = {
            "csid": csid
        }
        $.ajax({
            url: '/api/v1/cs/personalinfo/csid',
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
    static modifyNameCall(name, cbsuccess) {
        var strJson = {
            "name": name
        }
        $.ajax({
            url: '/api/v1/cs/personalinfo/name',
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
    static modifyPasswdCall(password, newpassword, cbsuccess) {
        var strJson = {
            "password": password,
            "newpassword":newpassword
        }
        $.ajax({
            url: '/api/v1/cs/personalinfo/password',
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
};
