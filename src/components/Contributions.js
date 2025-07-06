import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Contributions() {
  const [mode, setMode] = useState(""); // 'cash' or 'online'
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ✅ Handle Cash Contributions
  async function handleCashContribution(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMsg("❌ Please log in to contribute.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("contributions").insert([
      {
        user_id: user.id,
        amount: Number(amount),
        method: "cash",
        note,
        status: "success"
      }
    ]);

    setLoading(false);
    if (error) setMsg("❌ " + error.message);
    else setMsg("✅ Cash contribution recorded!");

    setAmount("");
    setNote("");
    setMode("");
  }

  // ✅ Handle Online Payment via Cashfree
  async function handleOnlinePayment(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMsg("❌ Please log in to contribute.");
      setLoading(false);
      return;
    }

    const payload = {
      amount: Number(amount),
      customer_id: user.id,
      customer_name: user.user_metadata?.name || user.email,
      customer_email: user.email,
      customer_phone: user.user_metadata?.phone || "9999999999"
    };

    console.log("📤 Sending payment payload:", payload);

    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: payload
      });

      console.log("✅ Payment API response:", data, error);

      if (error || !data?.payment_session_id) {
        setMsg("❌ Failed to initiate payment.");
        setLoading(false);
        return;
      }

      const cashfree = window.Cashfree({ mode: "sandbox" }); // change to "production" when ready
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self"
      });

    } catch (err) {
      console.error("❌ Payment initiation error:", err);
      setMsg("❌ Payment initiation failed.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 py-12">
      <h2 className="text-2xl font-bold mb-6 text-yellow-900">Contribute to Team Mahodara</h2>

      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-lg font-bold ${mode === "online" ? "bg-yellow-500 text-white" : "bg-white border border-yellow-400 text-yellow-800"}`}
          onClick={() => setMode("online")}
        >
          Pay Online
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-bold ${mode === "cash" ? "bg-yellow-500 text-white" : "bg-white border border-yellow-400 text-yellow-800"}`}
          onClick={() => setMode("cash")}
        >
          Add Cash Contribution
        </button>
      </div>

      {mode && (
        <form
          className="bg-white rounded-xl shadow-lg border-2 border-yellow-400 p-8 w-full max-w-sm flex flex-col gap-4"
          onSubmit={mode === "online" ? handleOnlinePayment : handleCashContribution}
        >
          <input
            type="number"
            min="1"
            step="1"
            className="rounded-lg px-3 py-2 border border-yellow-400 bg-white/70 focus:outline-none text-black"
            placeholder="Amount (INR)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <textarea
            className="rounded-lg px-3 py-2 border border-yellow-400 bg-white/70 focus:outline-none text-black"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg transition"
          >
            {loading
              ? "Processing..."
              : mode === "online"
              ? "Pay & Contribute"
              : "Add Cash Contribution"}
          </button>

          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 rounded-lg transition"
            onClick={() => {
              setMode("");
              setAmount("");
              setNote("");
              setMsg("");
            }}
          >
            Cancel
          </button>

          {msg && <div className="text-xs mt-2 text-center">{msg}</div>}
        </form>
      )}
    </div>
  );
}
