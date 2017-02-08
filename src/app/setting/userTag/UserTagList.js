import {UserTagUtil} from 'app/setting/userTag/UserTagUtil'

class TagStruct {
    constructor(tag_id, name, color, usage, evHandler) {
        this.evHandler = evHandler;
        this.tag_id = tag_id;
        this.name = name;
        this.color = color;
        this.usage = usage;
        if(null === usage) {
            var cbsuccess = function (cont, txtStatus, xhr) {
                //console.log("getTagUsage return:" + JSON.stringify(cont) + ", status:" + xhr.status);
                if (200 === xhr.status) {
                    var jsonRet = eval(cont);
                    this.usage = jsonRet.usage;
                    this.evHandler('u', '', '', '');
                }
            }
            UserTagUtil.getTagUsageCall(this.tag_id, cbsuccess.bind(this));
        }
    }
}

export class UserTagList {
    constructor(evHandler) {
        this.evHandler = evHandler;
        this.tagList = [];
    }

    getTagList() {
        return this.tagList;
    }

    getTagByIndex(idx) {
        return this.tagList[idx];
    }

    getTagById(tag_id) {
        for(var idx in this.tagList) {
            var tag = this.tagList[idx];
            if (tag.tag_id === tag_id) {
                return tag;
            }
        }
        return null;
    }

    pushTag(tag, isNew) {
        var usage = isNew ? 0 : null;
        this.tagList.push(
            new TagStruct(tag.tag_id, tag.name, tag.color, usage, this.evHandler)
        );
    }
    removeTag(tag_id) {
        for(var idx in this.tagList) {
            var tag = this.tagList[idx];
            if(tag_id === tag.tag_id) {
                this.tagList.splice(idx, 1);
                break;
            }
        }
    }
    updateTag(tag_id, name, color) {
        for(var idx in this.tagList) {
            var tag = this.tagList[idx];
            if (tag_id === tag.tag_id) {
                tag.name = name;
                tag.color = color;
                break;
            }
        }
    }
}
