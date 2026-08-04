import dayjs from "dayjs";

export const getTodayDate = () => dayjs().format("YYYY-MM-DD HH:mm");
