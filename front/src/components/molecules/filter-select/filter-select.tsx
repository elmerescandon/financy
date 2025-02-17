"use client";
import React, { useState } from "react";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";


const frameworksList = [
    { value: "react", label: "React", icon: Turtle },
    { value: "angular", label: "Angular", icon: Cat },
    { value: "vue", label: "Vue", icon: Dog },
    { value: "svelte", label: "Svelte", icon: Rabbit },
    { value: "ember", label: "Ember", icon: Fish },
];


const FilterSelect = () => {
    const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(frameworksList.map((framework) => framework.value));

    return (
        <MultiSelect
            className="mb-4 max-w-sm"
            options={frameworksList}
            onValueChange={setSelectedFrameworks}
            defaultValue={selectedFrameworks}
            placeholder="Select expense type"
            variant="inverted"
            animation={2}
            maxCount={1}
        />
    );
}

export default FilterSelect;