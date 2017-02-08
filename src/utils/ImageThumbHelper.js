var URL_SOMA = "soma";
var DEFAULT_IMG_THUMB_SIZE = "60x60";
 
export class ImageThumbHelper {

    static getThumbUrl(url, width, heigth) {
        if (url.indexOf(URL_SOMA) < 0) return url;
        var index = url.lastIndexOf('.');
        if (index <= 0) return url;

        return url.substr(0, index) + "_" + width + "x" + heigth + url.substr(index);
    }

    static getSquareThumbUrl(url, size) {
        if (url.indexOf(URL_SOMA) < 0) return url;
        var index = url.lastIndexOf('.');
        if (index <= 0) return url;

        return url.substr(0, index) + "_" + size + url.substr(index);
    }
    
    static getSquareThumbUrlByDefaultSize(url) {
        if (url.indexOf(URL_SOMA) < 0) return url;
        var index = url.lastIndexOf('.');
        if (index <= 0) return url;

        return url.substr(0, index) + "_" + DEFAULT_IMG_THUMB_SIZE + url.substr(index);
    }
}