export class TimeHelper {
    constructor(){
        this.timeDifference = 0;//本地时间和服务端的差值.
    }

    setTimeDifference(diff){
        this.timeDifference = diff;
    }

    getTimeDifference(){
        return this.timeDifference;
    }
    /**
     * days=0时表示获取今天的时间范围
     * days=1时表示获取获取昨天的时间范围
     * 其他days>1时,表示对应天数范围内的时间范围
     *
     * @param days
     * @returns {*[]}
     */
    static getTimeStamp(days) {
        var now = new Date(), mintime, maxtime;
        now.setHours(0);
        now.setMinutes(0)
        now.setSeconds(0);
        now.setMilliseconds(0);
        if (days > 0){
            now.setDate(now.getDate() - days);
        }
        mintime = now.valueOf();

        if (days > 1 && days < 3650) {
            now.setDate(now.getDate() + days - 1);
        } else if (days >= 3650){  // day>=3650,表示是all
            now.setDate(now.getDate() + days);
        }
        now.setHours(23);
        now.setMinutes(59);
        now.setSeconds(59);
        now.setMilliseconds(999);
        maxtime = now.valueOf();

        return [mintime, maxtime];
    }
}
let timeHelper = new TimeHelper();
export default timeHelper;



