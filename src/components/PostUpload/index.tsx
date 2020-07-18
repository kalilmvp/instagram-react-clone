import { Button } from "@material-ui/core";
import firebase from "firebase";
import React, { ChangeEvent, useCallback, useState } from "react";
import { db, storage } from "../../utils/firebase";
import "./styles.css";

interface PostUploadProps {
  userName: string;
}

const PostUpload: React.FC<PostUploadProps> = ({ userName }) => {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState<File>({} as File);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  }, []);

  const handleUpload = useCallback(() => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapShot) => {
        // progress.....
        setProgress((snapShot.bytesTransferred / snapShot.totalBytes) * 100);
      },
      (error) => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // do something with the url
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption,
              imageUrl: url,
              userName,
            });
          });

        setProgress(0);
        setCaption("");
      }
    );
  }, [caption, image, userName]);

  return (
    <div className="imageUpload">
      {/** <progress value={progress} max="100" />*/}
      <progress className="imageUpload__progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default PostUpload;
