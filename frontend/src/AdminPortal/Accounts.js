import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./admin.css";

const API_BASE = "http://localhost:5000"; // change if your backend URL is different

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); // All | Admin | User 

  // Fetch accounts from backend
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/accounts`);

        if (!mounted) return;

        const data = res.data;
        let list = Array.isArray(data) ? data : data.accounts || [];

        // Normalize for UI (role names + active flag)
        list = list.map((acc) => ({
          ...acc,
          // DB might have ADMIN / USER  – show pretty labels
          role:
            acc.role === "ADMIN"
              ? "Admin"
              : acc.role === "USER"
              ? "User"
              : acc.role,
          // derive boolean "active" from status if present
          active: acc.status
            ? acc.status.toUpperCase() !== "BANNED"
            : true,
        }));

        setAccounts(list);
        setErr("");
      } catch (e) {
        console.warn(
          "No backend yet or request failed, showing empty list.",
          e
        );
        if (mounted) {
          setErr("Failed to load accounts from server.");
          setAccounts([]); // keep layout visible
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Search + role filter
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = Array.isArray(accounts) ? accounts : [];

    return list.filter((a) => {
      const matchesText =
        !term ||
        a.full_name?.toLowerCase().includes(term) ||
        a.email?.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "All" || a.role === roleFilter;

      return matchesText && matchesRole;
    });
  }, [accounts, search, roleFilter]);

  // Optimistic ban / unban (server routes can be added later)
  async function toggleBan(acc) {
    const action = acc.active ? "ban" : "unban";
    const confirmMsg = acc.active
      ? `Ban ${acc.full_name || acc.email}?`
      : `Unban ${acc.full_name || acc.email}?`;
    if (!window.confirm(confirmMsg)) return;

    const prev = [...accounts];

    // optimistic update
    setAccounts((list) =>
      list.map((x) =>
        x.id === acc.id ? { ...x, active: !acc.active } : x
      )
    );

    try {
      // backend: PATCH /api/accounts/:id/ban or /unban
      await axios.patch(`${API_BASE}/api/accounts/${acc.id}/${action}`);
    } catch (e) {
      alert(`Failed to ${action}. Reverting.`);
      setAccounts(prev); // revert if request fails
    }
  }

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString() : "—";

  return (
    <div className="panel">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0, flex: 1 }}>Accounts</h2>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ maxWidth: 160 }}
        >
          <option>All</option>
          <option>Admin</option>
          <option>User</option>
        </select>

        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
      </div>

      {err && (
        <div
          style={{
            color: "#b42318",
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          {err}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th style={{ width: "28%" }}>Name</th>
            <th style={{ width: "28%" }}>Email</th>
            <th style={{ width: "12%" }}>Role</th>
            <th style={{ width: "12%" }}>Status</th>
            <th style={{ width: "12%" }}>Created</th>
            <th style={{ width: "8%" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                Loading accounts…
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
                No accounts found.
              </td>
            </tr>
          ) : (
            filtered.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.full_name || "—"}</td>
                <td>{acc.email}</td>
                <td>
                  <RoleBadge role={acc.role} />
                </td>
                <td>
                  {acc.active ? (
                    <span>Active</span>
                  ) : (
                    <span style={{ color: "#b42318" }}>Banned</span>
                  )}
                </td>
                <td>{formatDate(acc.created_at)}</td>
                <td>
                  <button
                    className={`btn ${acc.active ? "btn-danger" : ""}`}
                    onClick={() => toggleBan(acc)}
                    title={acc.active ? "Ban" : "Unban"}
                  >
                    {acc.active ? "Ban" : "Unban"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function RoleBadge({ role }) {
  const style =
    {
      Admin: {
        background: "#111827",
        color: "#fff",
      },
      User: {
        background: "#eef2ff",
        color: "#1e3a8a",
        border: "1px solid #c7d2fe",
      },
     
    }[role] ||
    {
      background: "#f4f4f5",
      color: "#111827",
      border: "1px solid #e6e6e9",
    };

  return (
    <span
      style={{
        ...style,
        padding: "3px 8px",
        borderRadius: 999,
        fontSize: 12,
      }}
    >
      {role || "—"}
    </span>
  );
}
