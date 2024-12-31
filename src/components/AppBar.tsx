import Link from "next/link";
import React from "react";
import { auth, signOut } from "../../auth";

const AppBar = async () => {
  const session = await auth();
  return (
    <div className="flex justify-between w-full h-14 lg:h-16 items-center border-b bg-gray-100/40 px-6">
      {session && session?.user ? <h2>Welcome {session?.user?.name}</h2> : <h2>Welcome to IMS</h2>}
    </div>
  );
};

export default AppBar;
