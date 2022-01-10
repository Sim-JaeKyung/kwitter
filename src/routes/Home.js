import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "@firebase/firestore";
import Kweet from "components/Kweet";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 } from "uuid";

const Home = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [kweets, setKweets] = useState([]);
  const [imgFile, setImgFile] = useState("");
  //getKweets는 구식 방법
  // const getKweets = async () => {
  //   const dbKweets = await getDocs(query(collection(dbService, "kweets")));
  //   dbKweets.forEach((document) => {
  //     const kweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     setKweets((prev) => [kweetObject, ...prev]);
  //   });
  // };
  useEffect(() => {
    // getKweets();
    onSnapshot(
      query(collection(dbService, "kweets"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const kweetArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setKweets(kweetArr);
      }
    );
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
    const response = await uploadString(fileRef, imgFile, "data_url");
    const fileUrl = await getDownloadURL(response.ref);
    const kweetObj = {
      text: kweet,
      creatorId: userObj.uid,
      createdAt: Date.now(),
      fileUrl,
    };
    await addDoc(collection(dbService, "kweets"), kweetObj);

    setKweet("");
    setImgFile("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setKweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const img = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setImgFile(result);
    };
    reader.readAsDataURL(img);
    //CreateObjectURL을 사용하면 data type이 image가 아닌 application/octet-stream으로 변환됨
    //그래서 다시 reader을 사용해 인코딩해주어야 한다
    //그래서 그냥 처음부터 reader을 사용하는 것이 좋다
    // const img = URL.createObjectURL(event.target.files[0]);
    // setImgFile(img);
  };
  const onClearClick = () => setImgFile("");

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          value={kweet}
          onChange={onChange}
          type="text"
          placeholder="What's New on your day?"
          maxLength={120}
        />
        <input type="file" accept="img/*" onChange={onFileChange} />
        <input type="submit" value="Kweet" />
        {imgFile && (
          <div>
            <img src={imgFile} width="100px" height="80px" />
            <button onClick={onClearClick}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {kweets.map((kweet) => (
          <Kweet
            key={kweet.id}
            kweetObj={kweet}
            isOwner={kweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};
export default Home;
