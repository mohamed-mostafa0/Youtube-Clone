


export const allowedFileTypes = {
    VIDEO : "video",
    IMAGE : "image"
}

export const maxFileSize = {
    VIDEO : 1000000000,
    IMAGE : 5000000
}

export const allowedFileExtenstions = {
    [allowedFileTypes.VIDEO]: ["mp4" , "webm" , "mpeg" , "avi"],
    [allowedFileTypes.IMAGE]: ["jpg" , "jpeg" , "png"]
}


export const videoCategories = ["gaming" , "music" , "news" , "technology" , "entertainment" , 
    "learning" , "travel" , "sports" , "science" , "history" , "cooking" , "fashion" , "beauty"
     , "fitness" , "health" , "finance" , "business" , "marketing" , "education" ,
      "food" , "travel" , "lifestyle" , "comedy" , "drama" , "action" , "thriller" ,
       "horror" , "romance" , "animation" , "documentary" , "short" , "vlog"]

export const videoVisibility = {
    PUBLIC:"public",
    PRIVATE:"private"
}

export const videoReactionType = {
    LIKE:"like",
    DISLIKE:"dislike"
}

export const VideoStatus = {
    PROCESSING:"processing",
    PUBLISHED:"published",
    FAILED:"failed"
}
