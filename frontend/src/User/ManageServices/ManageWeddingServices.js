import React, { useMemo, useState, useEffect } from "react";
import "../user-pages.css";
import Categories from "./Categories";
import ServicesByCategory from "./ServicesByCategory";
import ServiceDetail from "./ServiceDetail";

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
    () => [
      { id: "venue", name: "Venues", description: "Locations and spaces for your event" },
      { id: "catering", name: "Catering", description: "Food and beverage providers" },
      { id: "dj", name: "DJ & Music", description: "Entertainment and music" },
      { id: "photo", name: "Photography", description: "Photographers and videographers" }
    ],
    []
  );

  const allServices = useMemo(
    () => ({
      venue: [
        { id: "v1", name: "Grand Hall", description: "Elegant ballroom in city center", price: 4500, capacity: 250, available: true },
        { id: "v2", name: "Garden Terrace", description: "Outdoor venue with greenery", price: 3800, capacity: 180, available: true }
      ],
      catering: [
        { id: "c1", name: "Gourmet Feast", description: "Full-service fine dining catering", price: 65, available: true },
        { id: "c2", name: "Casual Bites", description: "Buffet-style comfort food", price: 35, available: false }
      ],
      dj: [
        { id: "d1", name: "DJ Spark", description: "High-energy mixes and lighting", price: 1200, available: true },
        { id: "d2", name: "DJ Calm", description: "Chill vibes and classics", price: 900, available: true }
      ],
      photo: [
        { id: "p1", name: "Lens Masters", description: "Photo + Video package", price: 2500, available: true },
        { id: "p2", name: "Candid Co.", description: "Candid photography specialists", price: 1800, available: true }
      ]
    }),
    []
  );

  const [plan, setPlan] = useState(() => loadPlan());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [compareSet, setCompareSet] = useState(new Set());

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  const servicesInCategory = selectedCategory ? allServices[selectedCategory.id] || [] : [];

  function handleAddToPlan(service) {
    if (!service) return;
    setPlan((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) return prev;
      return [...prev, { ...service, categoryId: selectedCategory ? selectedCategory.id : null }];
    });
    alert("Service added to your plan");
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

  const compareItems = useMemo(() => {
    if (!selectedCategory) return [];
    const pool = allServices[selectedCategory.id] || [];
    return pool.filter((s) => compareSet.has(s.id));
  }, [compareSet, allServices, selectedCategory]);

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="user-two-column">
          <div>
            {!selectedCategory && (
              <Categories categories={categories} onSelectCategory={(c) => { setSelectedCategory(c); setSelectedService(null); setCompareSet(new Set()); }} />
            )}

            {selectedCategory && !selectedService && (
              <ServicesByCategory
                category={selectedCategory}
                services={servicesInCategory}
                onBack={() => setSelectedCategory(null)}
                onViewDetails={(svc) => setSelectedService(svc)}
                onToggleCompare={toggleCompare}
                compareSet={compareSet}
              />
            )}

            {selectedService && (
              <ServiceDetail
                service={selectedService}
                onBack={() => setSelectedService(null)}
                onAddToPlan={handleAddToPlan}
              />
            )}
          </div>

          <aside className="user-sidebar">
            <div className="user-sidebar-title">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Your Plan</span>
                <button onClick={onExit} className="user-btn-link user-btn-small">Exit</button>
              </div>
            </div>
            <p className="user-subtitle" style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>Selected services are saved automatically.</p>
            {plan.length === 0 ? (
              <div className="user-empty">
                <div className="user-empty-text">No services selected yet.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {plan.map((p) => (
                  <div key={p.id} className="user-sidebar-item">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <div style={{ flex: 1 }}>
                        <div className="user-sidebar-item-title">{p.name}</div>
                        <div className="user-sidebar-item-text">${p.price}</div>
                      </div>
                      <button onClick={() => handleRemoveFromPlan(p.id)} className="user-btn-link user-btn-small" style={{ color: "#dc2626" }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCategory && compareItems.length > 0 && (
              <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e5e5" }}>
                <div className="user-section-title">Compare</div>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {compareItems.map((ci) => (
                    <div key={ci.id} className="user-sidebar-item">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className="user-sidebar-item-title">{ci.name}</div>
                        <div className="user-card-price" style={{ fontSize: "1rem" }}>${ci.price}</div>
                      </div>
                      <span className={`user-badge ${ci.available ? "user-badge-success" : "user-badge-danger"}`} style={{ marginTop: "0.5rem", display: "inline-block" }}>
                        {ci.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}


