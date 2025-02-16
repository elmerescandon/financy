import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react'

type SingleTextInputFormProps = {
    label: string;
    placeholder: string;
    htmlFor: string;
    error?: string[];
};

const SingleTextInputForm = ({
    label,
    placeholder,
    htmlFor,
    error,
}: SingleTextInputFormProps) => {
    return (
        <div className="mb-4 flex w-full flex-col gap-2">
            <Label htmlFor={htmlFor} className="font-semibold max-md:text-base">
                {label}
            </Label>
            <Input
                className="max-md:py-6 max-md:text-base"
                name={htmlFor}
                id={htmlFor}
                type="text"
                placeholder={placeholder}
                maxLength={200}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error.join(", ")}</p>}
        </div>
    );
}

export default SingleTextInputForm