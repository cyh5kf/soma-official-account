import $ from "jquery"

var somaUsers = {}

export class SomaUserDao{
    static getSomaUser(uid){
        if(id in somaUsers){
            return somaUsers[uid]
        }
        $.ajax({
            url: 'api/v1/soma/user/'+uid,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(user){
                somaUsers[user.uid] = user
            }
        });
        return somaUsers[id];
    }
}

export default