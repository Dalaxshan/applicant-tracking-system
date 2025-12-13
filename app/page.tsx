"use client";

import { useState, useEffect } from "react";

type Applicant = {
  id: number;
  name: string;
  email: string;
  skills: string;
  experience: number;
  notes: string | null;
  status: string;
};

export default function Home() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "0",
    notes: "",
  });

  const fetchApplicants = async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (sort) params.append("sort", sort);

    const res = await fetch(`/api/applicants?${params}`);
    const data = await res.json();
    console.log("data:", data);
    setApplicants(data);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchApplicants();
  }, [search, sort]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/applicants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, experience: Number(form.experience) }),
    });
    setForm({ name: "", email: "", skills: "", experience: "0", notes: "" });
    console.log('set form:', setForm);
    fetchApplicants();
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/applicants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchApplicants();
  };

  const deleteApplicant = async (id: number) => {
    await fetch(`/api/applicants/${id}`, { method: "DELETE" });
    fetchApplicants();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Applicant Tracking System
          </h1>

          {/* Add New Applicant Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-6 gap-4"
          >
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              required
              placeholder="Skills (comma-separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              required
              type="number"
              placeholder="Years of exp."
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              placeholder="Notes / Resume URL"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
              Add Applicant
            </button>
          </form>

          {/* Search + Sort */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Search name or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">No sorting</option>
              <option value="experience">Experience ↓</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-3">Name</th>
                  <th className="text-left px-6 py-3">Email</th>
                  <th className="text-left px-6 py-3">Skills</th>
                  <th className="text-left px-6 py-3">Exp</th>
                  <th className="text-left px-6 py-3">Notes</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{app.name}</td>
                    <td className="px-6 py-4">{app.email}</td>
                    <td className="px-6 py-4 text-sm">{app.skills}</td>
                    <td className="px-6 py-4 text-center">{app.experience}</td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {app.notes || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option>New</option>
                        <option>Interviewed</option>
                        <option>Rejected</option>
                        <option>Hired</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteApplicant(app.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applicants.length === 0 && (
              <p className="text-center py-12 text-gray-500">
                No applicants yet. Add one above!
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
