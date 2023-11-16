interface TimestampFormatterProps {
  timestamp: string;
  returnDate?: boolean;
  removeSomeData?: RemoveSomeDataKey[];
  dateSeparator?: string;
  returnTime?: boolean;
  dateOrder?: DateOrderKey;
  timeOrder?: TimeOrderKey;
  dateDisplayInterval?: DateIntervalKey;
}

type DateOrderKey = keyof DateOrderInterface;
type TimeOrderKey = keyof TimeOrderInterface;
type RemoveSomeDataKey = keyof RemoveSomeDataInterface;
type DateIntervalKey = keyof DateInterval;

interface DateOrderInterface {
  dd_mm_yy: string[];
  dd_yy_mm: string[];
  mm_dd_yy: string[];
  mm_yy_dd: string[];
  yy_mm_dd: string[];
  yy_dd_mm: string[];
}

interface TimeOrderInterface {
  hh_mm_ss: string[];
  hh_ss_mm: string[];
  mm_hh_ss: string[];
  mm_ss_hh: string[];
  ss_mm_hh: string[];
  ss_hh_mm: string[];
}

interface RemoveSomeDataInterface {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
}

interface DateInterval {
  beforeToday: string;
  beforeYesterday: string;
  beforeThisWeek: string;
  beforeThisMonth: string;
  beforeThisYear: string;
}

function TimestampFormatter(props: TimestampFormatterProps) {
  const formatTimestamp = (timestamp: string) => {
    const [datePart, timePart] = timestamp.split("T");

    const [splitedYear, splitedMonth, splitedDay] = datePart.split("-");
    const [splitedHour, splitedMinute, secondPlusZone] = timePart.split(":");
    const [splitedSecond, _zone] = secondPlusZone.split(".");

    let formatted = "";

    const returnIfExists = (param: string, type: RemoveSomeDataKey) => {
      return props.removeSomeData?.includes(type) ? "" : param;
    };

    if (props.returnDate) {
      const dateOrderMap: DateOrderInterface = {
        dd_mm_yy: [
          returnIfExists(splitedDay, "day"),
          returnIfExists(splitedMonth, "month"),
          returnIfExists(splitedYear, "year"),
        ],
        dd_yy_mm: [
          returnIfExists(splitedDay, "day"),
          returnIfExists(splitedYear, "year"),
          returnIfExists(splitedMonth, "month"),
        ],
        mm_dd_yy: [
          returnIfExists(splitedMonth, "month"),
          returnIfExists(splitedDay, "day"),
          returnIfExists(splitedYear, "year"),
        ],

        mm_yy_dd: [
          returnIfExists(splitedMonth, "month"),
          returnIfExists(splitedYear, "year"),
          returnIfExists(splitedDay, "day"),
        ],
        yy_mm_dd: [
          returnIfExists(splitedYear, "year"),
          returnIfExists(splitedMonth, "month"),
          returnIfExists(splitedDay, "day"),
        ],
        yy_dd_mm: [
          returnIfExists(splitedYear, "year"),
          returnIfExists(splitedDay, "day"),
          returnIfExists(splitedMonth, "month"),
        ],
      };

      const dateParts = dateOrderMap[props.dateOrder || "dd_mm_yy"] || [];

      const options = { timeZone: "America/Sao_Paulo" };
      const currentDateTime = new Date().toLocaleString("pt-BR", options);

      let shouldDisplay = true;
      const [datePart, _timePart] = currentDateTime.split(", ");
      const [currentDay, currentMonth, currentYear] = datePart.split("/");

      if (props.dateDisplayInterval) {
        switch (props.dateDisplayInterval) {
          case "beforeToday":
            shouldDisplay =
              parseInt(splitedYear) < parseInt(currentYear) ||
              (parseInt(splitedYear) === parseInt(currentYear) &&
                parseInt(splitedMonth) < parseInt(currentMonth)) ||
              (parseInt(splitedMonth) === parseInt(currentMonth) &&
                parseInt(splitedDay) < parseInt(currentDay));
            break;
          case "beforeYesterday":
            shouldDisplay =
              parseInt(splitedYear) < parseInt(currentYear) ||
              (parseInt(splitedYear) === parseInt(currentYear) &&
                parseInt(splitedMonth) < parseInt(currentMonth)) ||
              (parseInt(splitedMonth) === parseInt(currentMonth) &&
                parseInt(splitedDay) < parseInt(currentDay) - 1);
            break;
          case "beforeThisMonth":
            shouldDisplay =
              parseInt(splitedYear) < parseInt(currentYear) ||
              (parseInt(splitedYear) === parseInt(currentYear) &&
                parseInt(splitedMonth) < parseInt(currentMonth));
            break;
          case "beforeThisYear":
            shouldDisplay = parseInt(splitedYear) < parseInt(currentYear);
            break;
          default:
            shouldDisplay = true;
            break;
        }
      }

      if (shouldDisplay) {
        formatted += dateParts
          .filter((part) => part)
          .join(props.dateSeparator || "/");
      }
    }

    if (props.returnTime) {
      if (formatted !== "") {
        formatted += " ";
      }

      const timeOrderMap: TimeOrderInterface = {
        hh_mm_ss: [
          returnIfExists(splitedHour, "hour"),
          returnIfExists(splitedMinute, "minute"),
          returnIfExists(splitedSecond, "second"),
        ],
        hh_ss_mm: [
          returnIfExists(splitedHour, "hour"),
          returnIfExists(splitedSecond, "second"),
          returnIfExists(splitedMinute, "minute"),
        ],
        mm_hh_ss: [
          returnIfExists(splitedMinute, "minute"),
          returnIfExists(splitedHour, "hour"),
          returnIfExists(splitedSecond, "second"),
        ],
        mm_ss_hh: [
          returnIfExists(splitedMinute, "minute"),
          returnIfExists(splitedSecond, "second"),
          returnIfExists(splitedHour, "hour"),
        ],
        ss_mm_hh: [
          returnIfExists(splitedSecond, "second"),
          returnIfExists(splitedMinute, "minute"),
          returnIfExists(splitedHour, "hour"),
        ],
        ss_hh_mm: [
          returnIfExists(splitedSecond, "second"),
          returnIfExists(splitedHour, "hour"),
          returnIfExists(splitedMinute, "minute"),
        ],
      };

      const timeParts = timeOrderMap[props.timeOrder || "hh_mm_ss"] || [];

      formatted += timeParts.filter((part) => part).join(":");
    }

    return formatted;
  };

  const formattedTimestamp = formatTimestamp(props.timestamp);

  return <span className="formatted-timestamp">{formattedTimestamp}</span>;
}

export default TimestampFormatter;
