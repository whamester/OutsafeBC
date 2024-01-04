class DateFormat {
  constructor() {}

  static getDate(dateValue) {
    try {
      const date = dateValue.toLocaleString('en-CA', {
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
      const time = dateValue.toLocaleTimeString('en-CA', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      return time;
    } catch (error) {
      console.log(error);

      return time;
    }
  }
}

export default DateFormat;
