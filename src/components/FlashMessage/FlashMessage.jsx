import React from "react";
import { useFlash } from "../../context/FlashContext";
import "./FlashMessage.css";

const FlashMessage = () => {
  const { flash } = useFlash();

  if (!flash) return null; 

  return (
    <div className="flash-container">
      <div className={`flash-message ${flash.category}`}>{flash.message}</div>
    </div>
  );
};

export default FlashMessage;