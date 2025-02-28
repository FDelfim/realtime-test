import {
  collection,
  addDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { userNames } from "@/utils/names";

import { db } from "../../../db/firebase";
const messagesCollection = collection(db, 'messages');
import { serverTimestamp } from "firebase/firestore";

export async function POST() {
  const response = await fetch("http://localhost:3000/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });


  if(!response.ok) {
    throw new Error("Failed to fetch data from the server");
  }

  const data = await response.json();

  console.log(data);

  await addDoc(messagesCollection, {
    text: data.message,
    createdAt: serverTimestamp(),
    userName: userNames[Math.floor(Math.random() * userNames.length)].name,
    uid: '',
    photoURL: '',
  });

  return NextResponse.json(data);
}
