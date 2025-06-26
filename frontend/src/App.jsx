import React, { useState } from "react";
import axios from "axios";

function App() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [fetched, setFetched] = useState({});

  const saveUser = async () => {
    await axios.post("http://localhost:4000/api/save", { id, name, age });
    alert("Saved");
  };

  const fetchUser = async () => {
    const res = await axios.get(`http://localhost:4000/api/read/${id}`);
    setFetched(res.data);
  };

  return (
    <div>
      <h2>User Form</h2>
      <input placeholder="ID" onChange={(e) => setId(e.target.value)} />
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Age" onChange={(e) => setAge(e.target.value)} />
      <br />
      <button onClick={saveUser}>Submit</button>
      <button onClick={fetchUser}>Fetch</button>
      <div>
        <p>Name: {fetched.name}</p>
        <p>Age: {fetched.age}</p>
      </div>
    </div>
  );
}

export default App;
