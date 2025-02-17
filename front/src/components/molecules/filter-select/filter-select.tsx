"use client";
import React from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { financeOptions } from "@/lib/constants";
import { useTable } from "@/hooks/useTable";


const FilterSelect = () => {
    const { typeFilter, setTypeFilter } = useTable();
    if (!typeFilter) {
        return null;
    }
    const financeOptionsList = Object.entries(financeOptions).map(([key, value]) => ({
        value: key,
        label: value,
    }));

    return (
        <MultiSelect
            className="mb-4 max-w-sm max-md:max-w-md max-md:w-full"
            options={financeOptionsList}
            onValueChange={setTypeFilter}
            defaultValue={typeFilter}
            placeholder="Select expense type"
            variant="inverted"
            animation={2}
            maxCount={1}
        />
    );
}

export default FilterSelect;