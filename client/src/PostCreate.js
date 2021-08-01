import React, { useState } from "react";
import axios from "axios";

function PostCreate() {
  const [title, setTitle] = useState("");

  const onSubmit = () => {

  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          ></input>
        </div>
        <br />
        <button type='submit' className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default PostCreate;
