"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PasswordInput({ id, name, placeholder }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="pr-10"
        required
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
