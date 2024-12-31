"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignInventoryAccessToUser } from "@/actions/user";
import { toast } from "@/components/ui/use-toast";

const AssignInventoryActions = ({ clients }: { clients: any[] }) => {
  const handleChange = async (userId: string) => {
    const hasAccess = true;
    const res = await assignInventoryAccessToUser(userId, hasAccess);

    if (res.error) {
      toast({ title: res.error });
    } else {
      toast({ title: "User successfully assigned as 'user' with inventory access" });
    }
  };

  return (
    <div className="flex gap-8">
      <Select onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Assign a user" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select a user</SelectLabel>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AssignInventoryActions;
