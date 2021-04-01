import moment from "moment";

const moments = require("moment-timezone");

moments().tz("Asia/Bangkok").format();

moments.lang("th", { ordinal: Function });

const monthNames = [
  "",
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export default class TimeController {
  convertToDate(str) {
    const date = new Date(str);

    return moment(date).isValid() && str !== undefined ? date : "";
  }

  addMinutes(time, minsToAdd) {
    return moment
      .utc(time)
      .add(minsToAdd, "minutes")
      .tz("Asia/Bangkok")
      .format("YYYY-MM-DD HH:mm:ss");
  }

  reformat(time) {
    //?
    return moment
      .utc(time, "YYYY-MM-DD HH:mm:ss")
      .format("DD MMM YYYY HH:mm:ss");
  }

  reformatOiginal(time) {
    //?
    return moment.utc(time).format("LL");
  }

  reformatToDate(time) {
    return moment(time).isValid() && time !== undefined
      ? moment.utc(time).tz("Asia/Bangkok").format("YYYY-MM-DD")
      : "";
  }

  reformatToTime(time) {
    return moment(time).isValid() && time !== undefined
      ? moment.utc(time).tz("Asia/Bangkok").format("HHmm")
      : "";
  }

  reformatToDateTime(time) {
    return moment(time).isValid() && time !== undefined
      ? moment.utc(time).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
      : "";
  }

  showDateTH(time) {
    if (moment(time).isValid() && time !== undefined) {
      const day = moment.utc(time).tz("Asia/Bangkok").format("DD");
      const month = moment.utc(time).tz("Asia/Bangkok").format("MM");
      const year = moment.utc(time).tz("Asia/Bangkok").format("YYYY");

      return day + "/" + month + "/" + year;
    } else {
      return "";
    }
  }

  showDateTimeTH(time) {
    if (moment(time).isValid() && time !== undefined) {
      const day = moment.utc(time).tz("Asia/Bangkok").format("DD");
      const month = moment.utc(time).tz("Asia/Bangkok").format("MM");
      const year = moment.utc(time).tz("Asia/Bangkok").format("YYYY");
      const _time = moment.utc(time).tz("Asia/Bangkok").format("HH:mm");

      return day + "/" + month + "/" + year + " " + _time;
    } else {
      return "";
    }
  }

  showDateFullTH(time) {
    if (moment(time).isValid() && time !== undefined) {
      const day = moment.utc(time).tz("Asia/Bangkok").format("DD");
      const month = moment.utc(time).tz("Asia/Bangkok").format("MM");
      const year = moment.utc(time).tz("Asia/Bangkok").format("YYYY");

      return day + " " + monthNames[parseInt(month)] + " " + year;
    } else {
      return "";
    }
  }

  showDateTimeFullTH(time) {
    if (moment(time).isValid() && time !== undefined) {
      const day = moment.utc(time).tz("Asia/Bangkok").format("DD");
      const month = moment.utc(time).tz("Asia/Bangkok").format("MM");
      const year = moment.utc(time).tz("Asia/Bangkok").format("YYYY");
      const _time = moment.utc(time).tz("Asia/Bangkok").format("HH:mm");

      return (
        day +
        " " +
        monthNames[parseInt(month)] +
        " " +
        year +
        " เวลา " +
        _time +
        " น. "
      );
    } else {
      return "";
    }
  }
}
