import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { supabase } from "../supabaseClient";

export default function Contributions() {
  const [contributions, setContributions] = useState([]);
  const [contributor, setContributor] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContributions();
  }, []);

  async function fetchContributions() {
    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setContributions(data || []);
  }

  async function handleAddContribution(e) {
    e.preventDefault();
    if (!contributor || !amount) return;
    setLoading(true);
    const { error } = await supabase
      .from("contributions")
      .insert([{ contributor, amount: parseFloat(amount) }]);
    setLoading(false);
    if (!error) {
      setContributor("");
      setAmount("");
      fetchContributions();
    }
  }

  async function handleDeleteContribution(id) {
    if (!window.confirm("Are you sure you want to delete this contribution?")) return;
    const { error } = await supabase
      .from("contributions")
      .delete()
      .eq("id", id);
    if (!error) {
      fetchContributions();
    }
  }

  const totalContribution = contributions.reduce(
    (sum, c) => sum + (parseFloat(c.amount) || 0),
    0
  );

  return (
    <BackgroundWrapper>
      <PageContainer title="CONTRIBUTIONS">
        {/* Add Contribution Form */}
        <form onSubmit={handleAddContribution} className="flex flex-col gap-2 px-4 pb-4">
          <input
            type="text"
            placeholder="Contributor Name"
            className="rounded-lg px-3 py-2 border border-yellow-400 bg-white/70 focus:outline-none text-black"
            value={contributor}
            onChange={e => setContributor(e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Amount"
            className="rounded-lg px-3 py-2 border border-yellow-400 bg-white/70 focus:outline-none text-black"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg transition"
          >
            {loading ? "Adding..." : "Add Contribution"}
          </button>
        </form>
        {/* Total Contribution Info */}
        <div className="text-center text-yellow-900 font-bold mb-2">
          Total Contribution: ₹{totalContribution}
        </div>
        {/* Contributions List */}
        <div className="grid grid-cols-2 gap-2 px-3 pb-8 mt-4">
          {contributions.map((c) => (
            <div
              key={c.id}
              className="relative rounded-xl shadow p-2 flex flex-col items-center justify-center gap-1 transition"
              style={{
                minHeight: "54px",
                fontSize: "0.95rem",
                background: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(2px)",
                color: "#166534",
              }}
            >
              <span className="text-xl mb-0.5" style={{ color: "#388e3c" }}>₹</span>
              <span className="text-xs font-semibold">{c.contributor}</span>
              <span className="text-sm font-bold mt-0.5">{c.amount}</span>
              <button
                onClick={() => handleDeleteContribution(c.id)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-1 text-xs font-bold shadow transition"
                title="Delete"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </PageContainer>
    </BackgroundWrapper>
  );
}
