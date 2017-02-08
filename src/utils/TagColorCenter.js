
var tagcolors = [
    {'id':1, color:'orange',  val:'f8a94a'},
    {'id':2, color:'green',  val:'8fbb61'},
    {'id':3, color:'blue',    val:'4eb8cd'},
    {'id':4, color:'pink',    val:'ec80b8'},
    {'id':5, color:'red',     val:'ff6c6c'},
    {'id':6, color:'purple',  val:'a382d4'},
    {'id':7, color:'brown',   val:'a68a72'},
    {'id':8, color:'gray',    val: 'bbbbbb'}
]

export class TagColorCenter {

    static getColorArray() {
        return [].concat(tagcolors);
    }

    static getColorById(id) {
        if((id < 1) || (id > tagcolors.length)) {
            return {'id':id, color:'white', val:'ffffff'};
        }
        return tagcolors[id-1];
    }
}
