import React from "react";
import { createRoot } from "react-dom/client";
import { CardUpgrade } from "./card-upgrade.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <main>
    <header>
      <p className="brand">Real App Tools</p>
      <h1>Card Upgrade Calculator</h1>
      <p>Find the player card upgrade with the highest projected ROI within your Rax budget.</p>
    </header>
    <CardUpgrade />
  </main>,
);
