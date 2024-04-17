export const formatTime = (date) => {
  const postDate = new Date(date);
  const currentDate = new Date();

  let Difference_In_Time = currentDate.getTime() - postDate.getTime();
  let Difference_In_Minute = Math.round(Difference_In_Time / (1000 * 60));
  if (Difference_In_Minute < 60) {
    return `${Difference_In_Minute} minute`;
  }

  let Difference_In_Hours = Math.round(Difference_In_Time / (1000 * 3600));
  if (Difference_In_Hours < 24) {
    return `${Difference_In_Hours} jam`;
  }

  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  return `${Difference_In_Days} hari`;
};
