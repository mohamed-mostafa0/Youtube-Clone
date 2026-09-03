import { formatDistanceToNow } from "date-fns";

export const formatDuration = (duration) => {
    if (!duration) return "10:00";
    const num = Number(duration);
    if (!isNaN(num)) {
      return num.toFixed(2).replace('.', ':');
    }
    return duration;
  };

export const timeAgo = (date)=>{
    formatDistanceToNow(new Date(date), {addSuffix: true})
}