import dayjs, { Dayjs } from "dayjs";
import {
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_SHORT_FORM,
  DB_DATE_FORMAT,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATETIME_FORMAT,
} from "@/utils/constants";
import { Gender, SingerType } from "@/types/enums";
import type { User } from "@/types/models";

const dayOfWeekToString = (value: number | string, shortForm = false): string | null => {
  if (typeof value === "string") {
    const parsed = parseInt(value);
    if (isNaN(parsed)) {
      return null;
    } else {
      value = parsed;
    }
  }
  if (shortForm) {
    return DAYS_OF_WEEK_SHORT_FORM[value] || null;
  }
  return DAYS_OF_WEEK[value] || null;
};

const formatDate = (
  value?: string | Dayjs | null,
  outputFormat = DISPLAY_DATE_FORMAT,
  initialFormat = DB_DATE_FORMAT
): string => {
  if (!value) {
    return "--";
  }
  return dayjs(value, initialFormat).format(outputFormat);
};
const getFullName = (data: Partial<User>) => {
  return `${data?.lastName} ${data?.firstName}`;
};
const formatDateRange = (
  startDate: string | Dayjs | null,
  endDate: string | Dayjs | null,
  shortForm = false
): string => {
  if (!startDate || !endDate) {
    return "--";
  }
  const isSameYear = dayjs(startDate).year() === dayjs(endDate).year();
  const monthFormat = shortForm ? "MMM" : "MMMM";
  const startDateFormat = `D ${monthFormat}${isSameYear ? "" : " YYYY"}`;
  const endDateFormat = `D ${monthFormat} YYYY`;
  return `${formatDate(startDate, startDateFormat)} - ${formatDate(endDate, endDateFormat)}`;
};

const formatDatetime = (value: string): string => {
  return dayjs(value).format(DISPLAY_DATETIME_FORMAT);
};

const formatTime = (minutes: number): string => {
  const m = minutes % 60;
  const h = (minutes - m) / 60;
  return (h < 10 ? "0" : "") + h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
};

const formatMark = (mark: number): string => {
  return (Math.round(mark * 10) / 10).toFixed(1);
};

const formatMoney = (value: number): string => {
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(value);
};

const formatGender = (gender: Gender): string => toCapitalize(Gender[gender]);
const formatSinger = (singerType: SingerType): string => toCapitalize(SingerType[singerType]);

const dayjsToMinutes = (dayjsObj: Dayjs) => dayjsObj.hour() * 60 + dayjsObj.minute();
const formatYear = (dayjsObj: Dayjs) => dayjsObj.year();

const toCapitalize = (value: string): string => {
  if (!value) {
    return "";
  }
  return value
    .toLowerCase()
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
    .replace(/[-_]+(.)/g, (_, c) => " " + c); // First char after each -/_
};

export {
  dayOfWeekToString,
  formatDate,
  formatDateRange,
  formatDatetime,
  formatTime,
  formatMoney,
  formatGender,
  formatMark,
  getFullName,
  toCapitalize,
  dayjsToMinutes,
  formatSinger,
};
