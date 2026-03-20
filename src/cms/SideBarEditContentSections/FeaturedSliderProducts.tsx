import { MultiSelect } from "@/components/MultiSlectionInput";
import { useEffect, useState } from "react";
import { useCMS, } from "../store";
import { useGetProductsNameQuery } from "@/services/ProductsApi";



export default function SideBarEditContentSection() {
    const { selectedSection, updateProp } = useCMS();
    const { data: productsNames } = useGetProductsNameQuery(undefined);
    const [value, setValue] = useState<string[]>((selectedSection?.props as any)?.products || [])
    console.log(selectedSection)

    useEffect(() => {
        if (selectedSection) {
            updateProp(selectedSection.id, "products", (prev: any = []) => {
                return [...value]
            }
            )
        }
    }, [value])

    return (
        <div >
            <label className="text-sm font-medium capitalize mb-2 block">
                Slider  Featured Products
            </label>
            <div>
                <input
                    className="w-full border p-2 rounded"
                    value={(selectedSection?.props as any)?.title}
                    onChange={(e) => updateProp(selectedSection?.id || '', "title", e.target.value)}
                />
            </div>

            <div className="w-full h-full my-2">
                <MultiSelect
                    options={productsNames}
                    value={value}
                    onChange={setValue}
                    placeholder="Select frameworks"
                />
            </div>

        </div>
    );
}
