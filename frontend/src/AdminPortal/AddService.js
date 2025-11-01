import React, { useState } from "react";

export default function AddService() {
  const [form, setForm] = useState({
    type: "DJ",
    name: "",
    address: "",
    availableDate: "",
    bio: "",
    phone: "",
    email: "",
    price: "",
    capacity: "",
    photos: []
  });

  const [preview, setPreview] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handlePhotos(e) {
    const files = Array.from(e.target.files);
    setForm({ ...form, photos: files });
    setPreview(files.map(file => URL.createObjectURL(file)));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Service to submit:", form);
    alert("✅ Service saved (demo only)");
  }

  const showCapacity = form.type === "Venue";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Add Wedding Service</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>DJ</option>
            <option>Chef</option>
            <option>Cake Baker</option>
            <option>Florist</option>
            <option>Waiter</option>
            <option>Venue</option>
          </select>
        </div>

        {/* Common fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Available Date</label>
            <input
              type="date"
              name="availableDate"
              value={form.availableDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price (€)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        {showCapacity && (
          <div>
            <label className="block text-sm font-medium">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Bio / Description</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium">Upload Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotos}
            className="block w-full text-sm mt-1"
          />
          {preview.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {preview.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="preview"
                  className="h-20 w-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition"
        >
          Save Service
        </button>
      </form>
    </div>
  );
}
