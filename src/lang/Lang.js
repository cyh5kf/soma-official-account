import lang_en_US from 'lang/en_US'
import lang_zh_CN from 'lang/zh_CN'
import lang_es_CO from 'lang/es_CO'

var currLang = lang_en_US;
var langMap = {
    "en-US": lang_en_US,
    "zh-CN": lang_zh_CN,
    "es-CO": lang_es_CO
}

export class Lang {
    static setLang(lang) {
        currLang = langMap[lang];
        if (!currLang) {
            currLang = lang_en_US;
        }
    }

    static str(key) {
        var res = currLang[key];
        if (!res) {
            res = '#' + key + '#';
            return res;
        }

        var args = Array.prototype.slice.call(arguments, 1);
        if (args.length == 0) {
            return res;
        }

        return res.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
}

export default Lang;