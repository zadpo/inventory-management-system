import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { addUpdateInventory } from "@/actions/user";

type Props = {
  title: string;
  data: any;
};

const InventoryData = ({ title, data }: Props) => {
  const router = useRouter();
  const [formData, setFormData] = useState(data || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response: any = await addUpdateInventory(formData, data);
    if (response?.error) {
      toast({ title: response?.error });
    } else {
      toast({ title: "Inventory item created successfully" });
      router.refresh();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{title}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Add or update inventory items here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemName" className="text-right">
                Item Name
              </Label>
              <Input
                id="itemName"
                name="itemName"
                placeholder="Enter the item name"
                defaultValue={data?.itemName}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                placeholder="Enter the quantity (e.g., 10 kg)"
                defaultValue={data?.quantity}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costPerUnit" className="text-right">
                Cost per Unit
              </Label>
              <Input
                id="costPerUnit"
                name="costPerUnit"
                type="number"
                step="0.01"
                placeholder="Enter the cost per unit"
                defaultValue={data?.costPerUnit}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierBrand" className="text-right">
                Supplier/Brand
              </Label>
              <Input
                id="supplierBrand"
                name="supplierBrand"
                placeholder="Enter the supplier or brand"
                defaultValue={data?.supplierBrand}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reorderLevel" className="text-right">
                Reorder Level
              </Label>
              <Input
                id="reorderLevel"
                name="reorderLevel"
                placeholder="Enter the reorder level (e.g., 5 kg)"
                defaultValue={data?.reorderLevel}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expirationDate" className="text-right">
                Expiration Date
              </Label>
              <Input
                id="expirationDate"
                name="expirationDate"
                type="date"
                placeholder="Enter the expiration date"
                defaultValue={
                  data?.expirationDate ? new Date(data.expirationDate).toISOString().split("T")[0] : ""
                }
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default InventoryData;
