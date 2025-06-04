import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import profile from "../../assets/profile.jpg";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import {useParams} from 'react-router-dom'

const PlayVideo = ({ }) => {

  const {videoId} = useParams();

  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [channelData, setChannelData] = useState(null);

  const [commentsData, setCommentsData] = useState([]);

  const fetchVideoData = async () => {
    // Fetching Video Data
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=${API_KEY}&id=${videoId}`;
    await fetch(videoDetails_url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items[0]));
  };

  const fetchOtherData = async () => {
    //fetching channel data
    const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY} `;

    const data = await fetch(channelData_url)
      .then((res) => res.json())
      .then((data) => setChannelData(data.items[0]));

    //fetching Comment Data
    //    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}
    // `

    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;

    await fetch(comment_url)
      .then((res) => res.json())
      .then((data) => setCommentsData(data.items));

    // const commentRes = await fetch(comment_url);
    // const commentJson = await commentRes.json();
    // setCommentsData(commentJson.items );
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
  }, [apiData]);

  // useEffect(() => {
  //     if (commentsData) {
  //       console.log("Updated commentsData:", commentsData);
  //     }
  //   }, [commentsData]);

  return (
    <div className=" play-video ">
      <div className="play-video ">
        {/* {isVideoLoading && (
          <div className="video-loader">
            <div className="spinner"></div>
          </div>
        )} */}
      </div>
      {/* { <video
        src={video1}
        controls
        autoPlay
        muted
        onLoadedData={() => setIsVideoLoading(false)}
        style={{ visibility: isVideoLoading ? "hidden" : "visible" }}
      ></video>} */}
     <div className="screenfix">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>

      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "16k"}{" "}
          views &nbsp;
          {apiData
            ? moment(apiData.snippet.publishedAt).fromNow()
            : "2 days ago"}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : 155}
          </span>
          <span>
            <img src={dislike} alt="" />2
          </span>
          <span>
            <img src={share} alt="" />
            share
          </span>
          <span>
            <img src={save} alt="" />
            save
          </span>
        </div>
      </div>
      <hr />
      </div>
      <div className="publisher">
        <img
          src={channelData ? channelData.snippet.thumbnails.default.url : ""}
          alt=""
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : "1M"}{" "}
            Subscriber
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      <div className="vid-description">
        {/* <p>{apiData?apiData.snippet.description.slice(0, 250):"description here"}</p> */}

        <p>
          {apiData
            ? showMore
              ? apiData.snippet.description
              : apiData.snippet.description.slice(0, 250)
            : "description here"}
        </p>

        {apiData && apiData.snippet.description.length > 250 && (
          <span
            style={{ color: "#5a5a5a", cursor: "pointer", fontSize: "12px" }}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show less" : "Show more"}
          </span>
        )}

        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : 103}{" "}
          Comments
        </h4>

        {commentsData.map((item, index) => {
          return (
            
              <div key={index} className="comment" >
               

                <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" 
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = profile;  // Fallback image you imported
                  }}
                
                />
                <div>
                  <h3>
                    {item.snippet.topLevelComment.snippet.authorDisplayName} 
                    <span>{moment(item.snippet.topLevelComment.snippet.updatedAt).fromNow()}</span>
                  </h3>

                  <div>
                    <p>
                     {item.snippet.topLevelComment.snippet.textDisplay}
                    </p>
                    <div className="comment-action">
                      <img src={like} alt="" />
                      <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                      <img src={dislike} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;

