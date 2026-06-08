"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type PaymentRequest = {
  id: string;
  username: string;
  plan: string;
  transactionId: string;
  screenshotUrl?: string;
  status: string;
};

export default function AdminPage() {
  const [payments, setPayments] = useState<
    PaymentRequest[]
  >([]);
  const [loading, setLoading] = useState(true);

  async function loadPayments() {
    try {
      const snapshot = await getDocs(
        collection(db, "payments")
      );

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as PaymentRequest[];

      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    await updateDoc(
      doc(db, "payments", id),
      {
        status: "approved",
      }
    );

    alert("Payment Approved 😈");
    loadPayments();
  }

  async function reject(id: string) {
    await updateDoc(
      doc(db, "payments", id),
      {
        status: "rejected",
      }
    );

    alert("Payment Rejected ❌");
    loadPayments();
  }

  useEffect(() => {
    loadPayments();
  }, []);

  

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-black mb-6">
        Admin Panel 😈
      </h1>

      <div className="grid gap-5">
        {payments.length === 0 ? (
          <div>No payment requests found.</div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-xl border p-5 bg-white shadow"
            >
              <h2 className="text-xl font-bold">
                {payment.username}
              </h2>

              <p>
                <strong>Plan:</strong>{" "}
                {payment.plan}
              </p>

              <p>
                <strong>Transaction ID:</strong>{" "}
                {payment.transactionId}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {payment.status}
              </p>

              {payment.screenshotUrl && (
                <img
                  src={payment.screenshotUrl}
                  alt="payment"
                  className="mt-4 rounded-lg w-72 border"
                />
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() =>
                    approve(payment.id)
                  }
                  className="bg-green-600 text-white px-5 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    reject(payment.id)
                  }
                  className="bg-red-600 text-white px-5 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}