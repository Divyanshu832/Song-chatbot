import React from "react";

type Props = {};

const GPTLogo = (props: Props) => {
  return (
    <div
      style={{
        backgroundColor: "black",
      }}
      className="relative p-1 rounded-sm h-9 w-9 text-white flex items-center justify-center"
    >
      <img
        src="/Niggabot.png"
        alt="GPT Logo"
        className="w-8 h-8"
      />
    </div>
  );
};

export default GPTLogo;
