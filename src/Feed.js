import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import Post from "./Post";
import TweetInput from "./TweetInput";

const Feed = () => {
    const[posts,setPosts] = useState([
        {
            id:"",
            image:"",
            text:"",
            timestamp:null,
        },
    ]);

//記述2.useEffectの処理を書きます
useEffect(() => {
    const firebaseData = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
          }))
        )
      );
    return () => {
      firebaseData();
    };
  }, []);

console.log(posts)


    // 
    return (
        <div>

        <TweetInput />    
        {/* 記述3. Postコンポーネントを表示するロジックを書きます */}
        {
        posts &&(
        <>
        {posts.map((postItem) => (
            <Post
              key={postItem.id}
              image={postItem.image}
              text={postItem.text}
              timestamp={postItem.timestamp}
              id={postItem.id}
            />
        ))}
        
        </>
        )}

        {/*  */}
          
        </div>
    );
};

export default Feed;
