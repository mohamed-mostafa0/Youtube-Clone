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
    return formatDistanceToNow(new Date(date), {addSuffix: true})
}

export const formatViews = (views) => {
    if (!views && views !== 0) return "0";
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(views);
};