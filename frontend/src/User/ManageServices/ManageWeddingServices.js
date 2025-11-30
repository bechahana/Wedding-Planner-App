// src/User/ManageWeddingServices.js
import React, { useMemo, useState, useEffect } from "react";
import "../user-pages.css";
import Categories from "./Categories";
import ServicesByCategory from "./ServicesByCategory";
import ServiceDetail from "./ServiceDetail";
import { listServices } from "../../api/client";
import { SERVICE_TYPES } from "../../constants/serviceTypes";

const STORAGE_KEY = "weddingPlanServices";

function loadPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function savePlan(services) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

export default function ManageWeddingServices({ onExit }) {
  const categories = useMemo(
    () =>
      SERVICE_TYPES.map((t) => ({
        id: t,
        name: t,
        description: `Browse available ${t.toLowerCase()} services`,
      })),
    []
  );

  const [plan, setPlan] = useState(() => loadPlan());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [compareSet, setCompareSet] = useState(new Set());
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  async function fetchServices(type) {
    setLoading(true);
    const data = await listServices({ service_type: type });
    setServices(data);
    setLoading(false);
  }

  function handleSelectCategory(cat) {
    setSelectedCategory(cat);
    setSelectedService(null);
    setCompareSet(new Set());
    fetchServices(cat.id);
  }




  function handleAddToPlan(service) {
    if (!service) return;
    setPlan((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) return prev;
      return [...prev, service];
    });
  }

  function handleRemoveFromPlan(serviceId) {
    setPlan((prev) => prev.filter((s) => s.id !== serviceId));
  }

  function toggleCompare(service) {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(service.id)) next.delete(service.id);
      else next.add(service.id);
      return next;
    });
  }

  const compareItems = services.filter((s) => compareSet.has(s.id));

  function handleExitClick() {
    if (onExit) onExit();
    // optional: also clear compare selection etc.
  }

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="user-two-column">
          {/* LEFT: categories / services / detail */}
          <div>
            {!selectedCategory && (
              <Categories
                categories={categories}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {selectedCategory && !selectedService && (
              <>
                {loading && <p>Loading services…</p>}
                {!loading && (
                  <ServicesByCategory
                    category={selectedCategory}
                    services={services}
                    onBack={() => setSelectedCategory(null)}
                    onViewDetails={(svc) => setSelectedService(svc)}
                    onToggleCompare={toggleCompare}
                    compareSet={compareSet}
                    // (if ServicesByCategory has Add to Plan in future)
                    onAddToPlan={handleAddToPlan}
                  />
                )}
              </>
            )}

            {selectedService && (
              <ServiceDetail
                service={selectedService}
                onBack={() => setSelectedService(null)}
                onAddToPlan={handleAddToPlan}
              />
            )}
          </div>

          {/* RIGHT SIDEBAR FOR PLAN + COMPARE */}
          <aside className="user-sidebar">
            <div className="user-sidebar-title">
              <span>Your Plan</span>
              <button
                onClick={handleExitClick}
                className="user-btn-link user-btn-small"
              >
                Exit
              </button>
            </div>

            {plan.length === 0 ? (
              <div className="user-empty">
                <div className="user-empty-text">
                  No services selected yet.
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {plan.map((p) => (
                  <div key={p.id} className="user-sidebar-item">
                    <div className="user-sidebar-item-title">{p.name}</div>
                    <button
                      onClick={() => handleRemoveFromPlan(p.id)}
                      className="user-btn-link user-btn-small"
                      style={{ color: "#dc2626" }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {compareItems.length > 0 && (
              <>
                <div className="user-section-title">Compare</div>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {compareItems.map((ci) => (
                    <div key={ci.id} className="user-sidebar-item">
                      <div className="user-sidebar-item-title">
                        {ci.name}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </aside>


        </div>
      </div>
    </div>
  );
}



