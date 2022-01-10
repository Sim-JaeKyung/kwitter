import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";

const Kweet = ({ kweetObj, isOwner }) => {
  const KweetTextRef = doc(dbService, "kweets", `${kweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newKweet, setNewKweet] = useState(kweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delet this kweet?");
    if (ok) {
      //delete kweet
      await deleteDoc(KweetTextRef);
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(KweetTextRef, { text: newKweet });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewKweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your kweet"
              value={newKweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Kweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4> {kweetObj.text} </h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delet Kweet</button>
              <button onClick={toggleEditing}>Edit Kweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Kweet;
