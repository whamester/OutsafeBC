class DateFormat {
  constructor() {}

  static getDate(dateValue) {
    try {
      const date = dateValue.toLocaleString('default', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return date;
    } catch (error) {
      console.log(error);

      return dateValue;
    }
  }

  static getTime(dateValue) {
    try {
      const time = dateValue.toLocaleTimeString('default', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
      return time;
    } catch (error) {
      console.log(error);

      return time;
    }
  }
}

export default DateFormat;
