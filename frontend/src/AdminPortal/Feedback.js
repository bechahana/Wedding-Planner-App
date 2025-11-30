import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./admin.css";

const API_BASE = "http://localhost:5000"; 

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/feedback`);
        const data = Array.isArray(res.data) ? res.data : [];
        if (!mounted) return;
        setFeedbackList(data);
        setError("");
      } catch (err) {
        console.warn("No backend data yet, showing empty layout.", err);
        if (mounted) {
          setFeedbackList([]);
          setError("Failed to load feedback from server.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFeedback();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredFeedback = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return feedbackList;

    return feedbackList.filter((fb) => {
      return (
        fb.full_name?.toLowerCase().includes(term) ||
        fb.email?.toLowerCase().includes(term) ||
        fb.comment?.toLowerCase().includes(term)
      );
    });
  }, [feedbackList, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;

    const prev = [...feedbackList];
    setFeedbackList((list) => list.filter((fb) => fb.id !== id));

    try {
      await axios.delete(`${API_BASE}/api/feedback/${id}`);
    } catch (err) {
      alert("Failed to delete feedback, reverting.");
      setFeedbackList(prev);
    }
  };

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString() : "—";

  return (
    <div className="panel">
      <h2 style={{ marginBottom: "1rem" }}>User Feedback</h2>

      {/* Search bar */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="Search by name, email, or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {error && (
        <div
          style={{
            color: "#b42318",
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* Feedback Table */}
      <table>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Name</th>
            <th style={{ width: "25%" }}>Email</th>
            <th style={{ width: "35%" }}>Comment</th>
            <th style={{ width: "12%" }}>Date</th>
            <th style={{ width: "8%" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                Loading feedback...
              </td>
            </tr>
          ) : filteredFeedback.length > 0 ? (
            filteredFeedback.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.full_name || "—"}</td>
                <td>{fb.email || "—"}</td>
                <td>{fb.comment || "—"}</td>
                <td>{formatDate(fb.created_at)}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() =>
                      alert(
                        `From: ${fb.full_name || fb.email}\n\n${fb.comment || ""}`
                      )
                    }
                  >
                    View
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(fb.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  color: "#777",
                  fontStyle: "italic",
                  padding: "20px",
                }}
              >
                No feedback yet — your users’ feedback will appear here once
                added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
