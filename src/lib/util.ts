import { parseToRgb, toColorString } from "polished";
import dayjs from "dayjs";

export const formatDate = (date : dayjs.ConfigType, format = "YYYY-MM-DD") => {
  return dayjs(date).format(format);
};

export const delay = <T>(fn : () => T, time = 1000) : Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, time);
  });

