const AUTHORIZATION_KEY = import.meta.env.VITE_APP_AUTHORIZATION_KEY || "token";
const DISPLAY_DATE_FORMAT = "DD/MM/YYYY";
const FULL_DATE_FORMAT = "D MMMM, YYYY";
const DISPLAY_DATETIME_FORMAT = "DD/MM/YYYY, HH:mm";
const DB_DATE_FORMAT = "YYYY-MM-DD";
const DB_MONTH_FORMAT = "YYYY-MM";
const DISPLAY_TIME_FORMAT = "HH:mm";
const DISPLAY_DATE_MONTH_FORMAT = "DD/MM";
const DISPLAY_MONTH_YEAR_FORMAT = "MM/YY";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DAYS_OF_WEEK_SHORT_FORM = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export {
  AUTHORIZATION_KEY,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATETIME_FORMAT,
  DB_DATE_FORMAT,
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_SHORT_FORM,
  FULL_DATE_FORMAT,
  DISPLAY_TIME_FORMAT,
  DISPLAY_DATE_MONTH_FORMAT,
  DB_MONTH_FORMAT,
  DISPLAY_MONTH_YEAR_FORMAT,
};
