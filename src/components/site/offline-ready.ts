"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return () => {};
  navigator.serviceWorker.register("/sw.js");
  const check = () => {
    if (navigator.serviceWorker.controller) onStoreChange();
  };
  const onMessage = (e: MessageEvent) => {
    if (e.data === "sw-ready") onStoreChange();
  };
  navigator.serviceWorker.addEventListener("controllerchange", check);
  navigator.serviceWorker.addEventListener("message", onMessage);
  return () => {
    navigator.serviceWorker.removeEventListener("controllerchange", check);
    navigator.serviceWorker.removeEventListener("message", onMessage);
  };
}

const getSnapshot = () => !!navigator.serviceWorker?.controller;
const getServerSnapshot = () => false;

// True once a service worker controls this page — meaning install+precache
// finished and the SW actually intercepts requests (the real offline signal).
export function useOfflineReady() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
