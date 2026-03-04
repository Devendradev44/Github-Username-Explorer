import { useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const searchUser = async () => {
    if (!search) return;

    try {
      setLoading(true);
      setError("");
      setNotFound(false);
      setUser(null);

      const res = await fetch(`https://api.github.com/users/${search}`);

      if (res.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>GitHub User Explorer</h1>

      <div className="searchBox">
        {/* <input
          type="text"
          placeholder="Enter GitHub username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        <input
  type="text"
  placeholder="Enter GitHub username..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") searchUser();
  }}
/>

        <button onClick={searchUser}>Search</button>
      </div>

      {loading && <p className="status">Loading...</p>}

      {error && <p className="status error">{error}</p>}

      {notFound && (
        <div className="notFound">
          <h3>User not found</h3>
          <p>Please try another username.</p>
        </div>
      )}

      {user && (
        <div className="card">
          <img src={user.avatar_url} alt={user.login} />

          <h2>{user.login}</h2>

          {user.name && <p>{user.name}</p>}

          <div className="stats">
            <span>Repos: {user.public_repos}</span>
            <span>Followers: {user.followers}</span>
            <span>Following: {user.following}</span>
          </div>

          <a href={user.html_url} target="_blank" rel="noreferrer">
            View GitHub Profile
          </a>
        </div>
      )}
    </div>
  );
}

export default App;