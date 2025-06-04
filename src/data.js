export const API_KEY = 'AIzaSyDevYen5TFhl3xP3ZYN19VUrHYq6gBHuFI';


export const value_converter = (value) => {
    if(value>=1000000){
       return Math.floor(value/1000000)+"M"
    }
    else if(value>=1000){
       return Math.floor(value/1000)+"K"
    }

    else {
        return value;
    }


}




//  https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=0&key=[YOUR_API_KEY] HTTP/1.1												