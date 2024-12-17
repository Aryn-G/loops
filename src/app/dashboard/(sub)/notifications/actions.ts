"use server";

import mongoDB from "@/app/_db/connect";
import Subscription from "@/app/_db/models/Subscription";
import { toISOStringOffset } from "@/app/_lib/time";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:aryangera@hotmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function subscribeUser(sub: PushSubscription) {
  await mongoDB();

  const session = await auth();
  if (!session) return redirect("/");

  try {
    const newSub = new Subscription({
      session: session.id,
      endpoint: sub.endpoint,
      // @ts-ignore
      keys: { p256dh: sub.keys["p256dh"], auth: sub.keys["auth"] },
      createdAt: new Date(),
    });

    await newSub.save();
    revalidateTag("subscriptions");
  } catch (error) {
    console.log("Internal Error");
  }

  return { success: true };
}

export async function unsubscribeUser() {
  await mongoDB();

  const session = await auth();
  if (!session) return redirect("/");

  try {
    await Subscription.findOneAndDelete({ session: session.id });
    revalidateTag("subscriptions");
  } catch (error) {
    console.log("Internal Error");
  }
  return { success: true };
}

export async function sendNotification(
  title: string,
  message: string,
  url: string
) {
  await mongoDB();

  const session = await auth();
  if (!session) return redirect("/");

  try {
    const subscriptions = await Subscription.find({});
    const payload = JSON.stringify({
      title: title,
      body: message,
      // icon: "/icon.png",
      data: { url: url },
    });

    subscriptions.forEach(
      async (subscription) =>
        await webpush.sendNotification(subscription, payload)
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
