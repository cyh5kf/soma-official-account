Date.prototype.format = function(format) {
    // set default format if function argument not provided
    format = format || 'YYYY-MM-DD hh:mm';

    var zeropad = function (number, length) {
            number = number.toString();
            length = length || 2;
            while (number.length < length)
                number = '0' + number;
            return number;
        },
    // here you can define your formats
        formats = {
            YYYY: this.getFullYear(),
            MM: zeropad(this.getMonth() + 1),
            DD: zeropad(this.getDate()),
            hh: zeropad(this.getHours()),
            mm: zeropad(this.getMinutes())
        },
        pattern = '(' + Object.keys(formats).join(')|(') + ')';

    return format.replace(new RegExp(pattern, 'g'), function (match) {
        return formats[match];
    });
}

export default Date