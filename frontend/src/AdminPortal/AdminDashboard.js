import React, { useState } from "react";
import AddService from "./AddService";
import Accounts from "./Accounts";
import Feedback from "./Feedback";

export default function AdminDashboard() {
  const [tab, setTab] = useState("add-service");

  const NavItem = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      className={
        "w-full text-left rounded-xl px-3 py-2 transition " +
        (tab === id ? "bg-gray-900 text-white" : "hover:bg-gray-100")
      }
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Topbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 backdrop-blur px-4 py-3">
        <div className="font-semibold text-gray-800">Wedding Planner — Admin</div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:inline">admin@wedding.app</span>
          <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="border-r p-3 space-y-2">
          <div className="px-2 pt-1 pb-3 text-xs uppercase tracking-wide text-gray-500">
            Admin Panel
          </div>
          <NavItem id="add-service" label="Add Service" />
          <NavItem id="accounts" label="Accounts" />
          <NavItem id="feedback" label="Feedback" />
        </aside>

        {/* Content */}
        <main className="p-4">
          {tab === "add-service" && <AddService />}
          {tab === "accounts" && <Accounts />}
          {tab === "feedback" && <Feedback />}
        </main>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import AddService from "./AddService";
import Accounts from "./Accounts";
import Feedback from "./Feedback";

export default function AdminDashboard() {
  const [tab, setTab] = useState("add-service");

  const NavItem = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      className={
        "w-full text-left rounded-xl px-3 py-2 transition " +
        (tab === id ? "bg-gray-900 text-white" : "hover:bg-gray-100")
      }
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Topbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 backdrop-blur px-4 py-3">
        <div className="font-semibold text-gray-800">Wedding Planner — Admin</div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:inline">admin@wedding.app</span>
          <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="border-r p-3 space-y-2">
          <div className="px-2 pt-1 pb-3 text-xs uppercase tracking-wide text-gray-500">
            Admin Panel
          </div>
          <NavItem id="add-service" label="Add Service" />
          <NavItem id="accounts" label="Accounts" />
          <NavItem id="feedback" label="Feedback" />
        </aside>

        {/* Content */}
        <main className="p-4">
          {tab === "add-service" && <AddService />}
          {tab === "accounts" && <Accounts />}
          {tab === "feedback" && <Feedback />}
        </main>
      </div>
    </div>
  );
}
