"use client";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useMediaQuery } from "./_lib/use-hooks/useMediaQuery";

export default function InstallPrompt({ barebone }: { barebone?: boolean }) {
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  const isStandalone = useMediaQuery("(display-mode: standalone)", {
    defaultValue: false,
  });

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleClick = async () => {
    if (!deferredPrompt) return;

    // @ts-ignore
    deferredPrompt.prompt();
    // @ts-ignore
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    setDeferredPrompt(null);
  };

  if (isStandalone) {
    return null;
  }

  if (deferredPrompt == null && !isIOS) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-3 max-w-md">
      {!barebone && (
        <>
          <h2 className="font-bold text-3xl mt-6">Install App</h2>

          <p className="">
            Did you know you can install this app on your device for quick
            access?{" "}
            {deferredPrompt != null && (
              <>
                Just click <span className="font-bold">Add to Home Screen</span>{" "}
                and enjoy a seamless experience, right from your home screen!
              </>
            )}
          </p>
        </>
      )}
      {deferredPrompt != null && (
        <button
          onClick={handleClick}
          className="brutal-md font-bold px-4 flex items-center gap-2 w-fit"
        >
          Add to Home Screen
          <PlusIcon className="size-5" />
        </button>
      )}

      {deferredPrompt == null && isIOS && (
        <p className="mt-2">
          To install this app on your iOS device, tap the{" "}
          <span className="inline-flex items-center justify-center gap-0.5 font-bold">
            Share <ArrowUpOnSquareIcon className="size-4 inline stroke-[2]" />
          </span>{" "}
          and then{" "}
          <span className="inline-flex items-center justify-center gap-0.5 font-bold">
            Add to Home Screen
            <PlusIcon className="size-5 inline" />
          </span>
        </p>
      )}
    </div>
  );
}
