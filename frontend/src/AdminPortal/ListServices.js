import React, { useEffect, useMemo, useState } from "react";
import "./admin.css";
import { listServices } from "../api/client";

const SERVICE_TYPES = ["All", "DJ", "Chef", "Cake Baker", "Florist", "Waiter", "Venue"];

export default function ListServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  // 🔄 Fetch services on mount and when typeFilter changes
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setLoading(true);
      setErr("");

      try {
        const data = await listServices({
          service_type: typeFilter === "All" ? undefined : typeFilter,
        });

        if (!mounted) return;
        setServices(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setErr("Failed to load services. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [typeFilter]);

  // 🔍 Filter + sort (by type then name)
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const base = services.filter((s) => {
      const matchesText =
        !term ||
        s.name?.toLowerCase().includes(term) ||
        s.address?.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term);

      return matchesText;
    });

    // Sort: service_type ASC, name ASC
    return base.slice().sort((a, b) => {
      const t1 = a.service_type || "";
      const t2 = b.service_type || "";
      if (t1 < t2) return -1;
      if (t1 > t2) return 1;
      const n1 = a.name || "";
      const n2 = b.name || "";
      return n1.localeCompare(n2);
    });
  }, [services, search]);

  return (
    <div className="panel">
      <h2>List Services</h2>
      <p className="subtitle">
        View and manage all services stored in the database, sorted by type.
      </p>

      {/* Toolbar */}
      <div className="toolbar">
        <label style={{ fontSize: 14 }}>
          Service Type:&nbsp;
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <input
          type="text"
          placeholder="Search by name, address, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />

        <div className="spacer" />

        <span style={{ fontSize: 13, color: "#6b7280" }}>
          {filtered.length} service{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {err && (
        <div style={{ color: "#b42318", marginBottom: 10, fontSize: 14 }}>
          {err}
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "15%" }}>Type</th>
              <th style={{ width: "20%" }}>Name</th>
              <th style={{ width: "20%" }}>Address</th>
              <th style={{ width: "10%" }}>Price</th>
              <th style={{ width: "20%" }}>Contact</th>
              <th style={{ width: "15%" }}>Photos</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                  Loading services…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: 20,
                    color: "#777",
                    fontStyle: "italic",
                  }}
                >
                  No services found.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id}>
                  <td>{s.service_type || "—"}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name || "—"}</div>
                    {s.description && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#6b7280",
                          maxWidth: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={s.description}
                      >
                        {s.description}
                      </div>
                    )}
                  </td>
                  <td>{s.address || "—"}</td>
                  <td>
                    {s.price != null && s.price !== ""
                      ? `${s.price} €`
                      : "—"}
                  </td>
                  <td>
                    {s.email && (
                      <div style={{ fontSize: 13 }}>{s.email}</div>
                    )}
                    {s.phone_number && (
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {s.phone_number}
                      </div>
                    )}
                  </td>
                  <td>
                    {Array.isArray(s.photos) && s.photos.length > 0 ? (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {s.photos.slice(0, 3).map((url) => (
                          <img
                            key={url}
                            src={`http://localhost:5000${url}`}
                            alt={s.name}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 6,
                              border: "1px solid #f1d5ea",
                            }}
                          />
                        ))}
                        {s.photos.length > 3 && (
                          <span style={{ fontSize: 12, color: "#6b7280" }}>
                            +{s.photos.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>
                        No photos
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
