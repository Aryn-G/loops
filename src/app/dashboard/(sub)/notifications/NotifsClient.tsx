"use client";

import { getUserSubscriptions } from "@/app/_db/queries/subscriptions";
import { urlBase64ToUint8Array } from "@/app/_lib/util";
import InstallPrompt from "@/app/InstallPrompt";
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/20/solid";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import title from "title";
import { sendNotification, subscribeUser, unsubscribeUser } from "./actions";

type Sub = Awaited<ReturnType<typeof getUserSubscriptions>>[number];

type Props = {
  userSubs: Sub[];
  session: Session;
};

const NotifsClient = (props: Props) => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    await subscribeUser(sub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  if (!isSupported)
    return (
      <div className="flex flex-col items-center gap-4">
        <p>Notifications enabled aren't available in this enviornment. </p>
        {/* <InstallPrompt barebone /> */}
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4">
      {subscription ? (
        <>
          <p>You are subscribed to notifications.</p>
          <button
            className="brutal-sm px-4 font-bold bg-rose-500 text-white"
            onClick={unsubscribeFromPush}
          >
            Disable Notifications
          </button>
          {/* <button onClick={sendTestNotification}>Send Test</button> */}
        </>
      ) : (
        <>
          <p>You aren{"'"}t subscribed to notifications.</p>
          <button
            className="brutal-sm px-4 font-bold bg-ncssm-green text-white"
            onClick={subscribeToPush}
          >
            Enable Notifications
          </button>
        </>
      )}
    </div>
  );
};

export default NotifsClient;
