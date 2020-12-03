import React, { useState } from "react";
import { storage, db } from "./firebase";
import firebase from "firebase/app";
import { Button, IconButton } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import "./style.css";

const TweetInput = () => {
  // 記述3. useStateを用意します　画像を保持する箱、入力された文字列を保持する箱
  const [inputImage, setInputImage] = useState(null);
  const [message, setMessage] = useState("");
  const onChangeImageHandler = (e) => {
    if (e.target.files[0]) {
      setInputImage(e.target.files[0]);
      e.target.value = "";
    }
  };
  // 記述7.送信処理を記述
  const sendTweet = (e) => {
    // 状態を確認する
    console.log(message, inputImage);
    e.preventDefault();
    if (inputImage) {
      // 画像 + テキストの処理
      // firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元々あったファイルが削除される
      // そのためにファイル名をランダムなファイル名を作る必要がある、それが下
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
      const N = 16; //16文字の文字列を作るという意味　生成したい文字数が１６の文字列になる
      const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が１６こ選ばれる
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomMoji + "_" + inputImage.name;
      // firebase storageに登録する処理
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(inputImage);
      // firebaseのDBに登録する処理
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {}, //進捗度合いの管理するもの、
        (err) => {
          //エラーに関する処理
          alert(err.message);
        },
        async () => {
          //成功したとき
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                image: url,
                text: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
        }
      );
    } else {
      // テキストだけの処理
      db.collection("posts").add({
        image: "",
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setInputImage(null);
    setMessage("");



  };

  // returnして返す
  return (
    <div>
      <h1>インスタグラムだよ！</h1>
      {/* 記述1. formのタグを書く */}
      <form onSubmit={sendTweet}  className="form">
        {/* 記述2 inputタグを書きます */}
        <textarea
          className="input"
          placeholder="コメントを追加..."
          type="textarea"
          cols="50"
          rows="3"
        
          autoFocus
          value={message}
          // eventを書きます onChange
          // 記述6 event
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton className="IconButton">
          <label>
            <AddAPhotoIcon />
            <input type="file" onChange={onChangeImageHandler} />
          </label>
        </IconButton>
        <AwesomeButton id="AwesomeButton" type="submit" disabled={!message}>
          ここをClickして送信
        </AwesomeButton>
      </form>
      {/*  */}
    </div>
  );
};
export default TweetInput;