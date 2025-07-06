import React, { useEffect, useRef, useState } from "react";
import { usePortStore } from "../../../store/portStore";
import { GrRefresh } from "react-icons/gr";

const Browser = () => {
  const { port } = usePortStore();

  const browserRef = useRef(null);

  const [reloadKey, setReloadKey] = useState(0);

  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1); // change key to remount iframe
  };

  if (!port) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[100vh] w-full ">
      <div className="flex gap-4 items-center px-4 py-2 bg-[hsl(0,0%,25%)]">
        <GrRefresh
          size={20}
          className="cursor-pointer"
          onClick={handleRefresh}
        />
        <input
          type="text"
          defaultValue={`http://localhost:${port}`}
          readOnly
          className="text-[hsl(0,0%,90%)] font-semibold p-2 outline-none w-[80%] bg-[hsl(0,0%,10%)] rounded-md"
        ></input>
      </div>

      <iframe
        ref={browserRef}
        key={`${port}-${reloadKey}`}
        src={`http://localhost:${port}`}
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default Browser;
