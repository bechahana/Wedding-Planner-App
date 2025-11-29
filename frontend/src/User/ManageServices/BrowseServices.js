// src/User/BrowseServices.js
import React, { useEffect, useState, useMemo } from "react";
import "../user-pages.css"; // or reuse admin.css for now
import { listServices } from "../../api/client";
import { SERVICE_TYPES_WITH_ALL } from "../../constants/serviceTypes";

export default function BrowseServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");

    listServices({
      service_type: typeFilter === "All" ? undefined : typeFilter,
    })
      .then((data) => {
        if (mounted) setServices(data);
      })
      .catch((e) => {
        console.error(e);
        if (mounted) setErr("Failed to load services");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [typeFilter]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return services.filter((s) => {
      if (!term) return true;
      const text =
        `${s.name} ${s.address || ""} ${s.description || ""} ${s.email || ""}`.toLowerCase();
      return text.includes(term);
    });
  }, [services, search]);

  return (
    <div className="user-services-page">
      <h2>Available Wedding Services</h2>

      {/* Category filter */}
      <div className="service-filters">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {SERVICE_TYPES_WITH_ALL.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Simple text search */}
        <input
          type="text"
          placeholder="Search by name, address, description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>Loading services…</p>}
      {err && <p className="error">{err}</p>}

      {!loading && !err && filtered.length === 0 && (
        <p>No services found for this filter.</p>
      )}

      <div className="service-list">
        {filtered.map((s) => (
          <div key={s.id} className="service-card">
            <div className="service-type">{s.service_type}</div>
            <h3>{s.name}</h3>
            {s.address && <p>{s.address}</p>}
            <p>Price: €{s.price}</p>
            {s.description && <p>{s.description}</p>}
            {s.photos && s.photos.length > 0 && (
              <div className="service-photos">
                {s.photos.map((url, i) => (
                  <img key={i} src={url} alt={`${s.name} ${i + 1}`} />
                ))}
              </div>
            )}
            <p>
              Contact: {s.phone_number || "N/A"} | {s.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
