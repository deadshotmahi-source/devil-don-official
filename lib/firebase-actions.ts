import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { planDays } from "@/lib/utils";
import type { AppUser, PaymentRequest, PlanName } from "@/lib/types";

export async function createPaymentRequest(params: {
  user: AppUser;
  plan: PlanName;
  transactionId: string;
  screenshot: File;
}) {
  const screenshotRef = ref(
    storage,
    `payment-screenshots/${params.user.uid}/${Date.now()}-${params.screenshot.name}`
  );
  await uploadBytes(screenshotRef, params.screenshot);
  const screenshotUrl = await getDownloadURL(screenshotRef);

  return addDoc(collection(db, "payments"), {
    userId: params.user.uid,
    username: params.user.username,
    plan: params.plan,
    transactionId: params.transactionId,
    screenshotUrl,
    status: "pending",
    createdAt: serverTimestamp()
  });
}

export async function generateKey(plan: PlanName, username?: string, userId?: string) {
  const code = `DD-${plan.replace(/[^A-Z0-9]/gi, "").toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  return addDoc(collection(db, "keys"), {
    code,
    plan,
    status: userId ? "active" : "unused",
    username: username || "",
    userId: userId || "",
    createdAt: serverTimestamp(),
    ...(userId
      ? {
          activatedAt: serverTimestamp(),
          expiryAt: new Date(Date.now() + planDays(plan) * 24 * 60 * 60 * 1000)
        }
      : {})
  });
}

export async function approvePayment(payment: PaymentRequest) {
  const keyRef = await generateKey(payment.plan, payment.username, payment.userId);
  const expiryAt = new Date(Date.now() + planDays(payment.plan) * 24 * 60 * 60 * 1000);
  await updateDoc(doc(db, "payments", payment.id), { status: "approved", keyId: keyRef.id });
  await setDoc(
    doc(db, "subscriptions", payment.userId),
    {
      userId: payment.userId,
      username: payment.username,
      plan: payment.plan,
      status: "active",
      keyId: keyRef.id,
      expiryAt,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
  await updateDoc(doc(db, "users", payment.userId), {
    activeKeyId: keyRef.id,
    subscriptionType: payment.plan,
    keyExpiry: expiryAt
  });
}

export async function activateKey(user: AppUser, keyCode: string) {
  const snap = await getDocs(
    query(collection(db, "keys"), where("code", "==", keyCode.trim().toUpperCase()), limit(1))
  );
  if (snap.empty) throw new Error("Key not found.");
  const keyDoc = snap.docs[0];
  const key = keyDoc.data() as { plan: PlanName; status: string };
  if (key.status !== "unused") throw new Error("This key is not available.");
  const expiryAt = new Date(Date.now() + planDays(key.plan) * 24 * 60 * 60 * 1000);
  await updateDoc(doc(db, "keys", keyDoc.id), {
    status: "active",
    userId: user.uid,
    username: user.username,
    activatedAt: serverTimestamp(),
    expiryAt
  });
  await setDoc(
    doc(db, "subscriptions", user.uid),
    {
      userId: user.uid,
      username: user.username,
      plan: key.plan,
      status: "active",
      keyId: keyDoc.id,
      expiryAt,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
  await updateDoc(doc(db, "users", user.uid), {
    activeKeyId: keyDoc.id,
    subscriptionType: key.plan,
    keyExpiry: expiryAt
  });
}

export async function uploadApk(version: string, file: File) {
  const apkRef = ref(storage, `apk/${Date.now()}-${file.name}`);
  await uploadBytes(apkRef, file);
  const url = await getDownloadURL(apkRef);
  return addDoc(collection(db, "apk_files"), {
    version,
    fileName: file.name,
    url,
    createdAt: serverTimestamp()
  });
}

export async function latestApks() {
  return getDocs(query(collection(db, "apk_files"), orderBy("createdAt", "desc"), limit(5)));
}

export async function deleteRecord(collectionName: string, id: string) {
  return deleteDoc(doc(db, collectionName, id));
}
