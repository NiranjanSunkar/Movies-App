import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [editMovie, setEditMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: ""
  });

  const [newMovie, setNewMovie] = useState({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: ""
  });

  // ✅ Fetch all movies
  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/movies");
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // ✅ Delete a movie
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/movies/${id}`);
      alert("Movie deleted successfully!");
      fetchMovies();
    } catch (err) {
      console.error("Error deleting movie:", err);
      alert("Failed to delete movie!");
    }
  };

  // ✅ Edit movie
  const openEditModal = (movie) => {
    setEditMovie(movie);
    setFormData({ ...movie });
  };

  const handleEditChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/movies/${editMovie.id}`, formData);
      alert("Movie updated successfully!");
      setEditMovie(null);
      fetchMovies();
    } catch (err) {
      console.error("Error updating movie:", err);
      alert("Failed to update movie!");
    }
  };

  const closeModal = () => {
    setEditMovie(null);
  };

  // ✅ Add new movie
  const handleAddMovieChange = (e) => {
    setNewMovie({
      ...newMovie,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/movies", newMovie);
      alert("🎬 Movie added successfully!");
      setNewMovie({
        title: "",
        type: "",
        director: "",
        budget: "",
        location: "",
        duration: "",
        year: ""
      });
      fetchMovies();
    } catch (err) {
      console.error("Error adding movie:", err);
      alert("Failed to add movie!");
    }
  };

  return (
    <div className="container">
      <h1 className="title">🎞️ Movie Management System</h1>

      {/* ✅ Add Movie Form */}
      <div className="add-movie-form">
        <h2>Add New Movie</h2>
        <form onSubmit={handleAddMovie}>
          <div className="form-grid">
            {["title", "type", "director", "budget", "location", "duration", "year"].map((field) => (
              <div key={field} className="form-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type="text"
                  name={field}
                  value={newMovie[field]}
                  onChange={handleAddMovieChange}
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit" className="add-btn">Add Movie</button>
        </form>
      </div>

      {/* ✅ Movies Table */}
      <table className="movie-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Director</th>
            <th>Budget</th>
            <th>Location</th>
            <th>Duration</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.length > 0 ? (
            movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{movie.type}</td>
                <td>{movie.director}</td>
                <td>{movie.budget}</td>
                <td>{movie.location}</td>
                <td>{movie.duration}</td>
                <td>{movie.year}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEditModal(movie)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(movie.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No movies found 😢</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Edit Modal */}
      {editMovie && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Movie Details</h2>

            <div className="modal-form">
              {["title", "type", "director", "budget", "location", "duration", "year"].map((field) => (
                <div key={field} className="form-group">
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleEditChange}
                  />
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;