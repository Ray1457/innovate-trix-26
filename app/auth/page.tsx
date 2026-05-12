import { Suspense } from "react";
import Home from "../page";
import UberLoginModal from "./UberLoginModal";

export default function UberAuthPage() {
  return (
    <>
      <Home />
      <Suspense fallback={null}>
        <UberLoginModal />
      </Suspense>
    </>
  );
}
