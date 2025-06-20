import React from "react";
import { useReducer } from "react";
import "../styles/stateHoverWrapper.css";

export const StateHoverWrapper = ({
  stateProp,
  className,
  text = "Dashboard",
}) => {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp || "hover",
  });

  return (
    <div
      className={`state-hover-wrapper ${state.state} ${className}`}
      onClick={() => {
        dispatch("click");
      }}
    >
      <div className="text-wrapper">{text}</div>

      {state.state === "variant-3" && <div className="rectangle" />}
    </div>
  );
};

function reducer(state, action) {
  switch (action) {
    case "click":
      return {
        ...state,
        state: "variant-3",
      };
  }

  return state;
}
