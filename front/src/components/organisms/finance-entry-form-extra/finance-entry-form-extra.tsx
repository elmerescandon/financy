import { DatePicker } from '@/components/molecules/date-input-form/date-input-form'
import SingleTextInputForm from '@/components/molecules/single-text-input-form/single-text-input-form'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SaveEntryActionResponse } from '@/types/save-entry-form'
import { ChevronDownIcon } from 'lucide-react'
import React from 'react'

type FinanceEntryFormExtraProps = {
    state: SaveEntryActionResponse
}



const FinanceEntryFormExtra = ({ state }: FinanceEntryFormExtraProps) => {
    return (

        <Accordion type="single" collapsible className='mb-4'>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <span className='font-semibold'>Add more information</span>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='flex gap-4 flex-col mx-2'>
                        {/* TODO: Fix bug -> when you don't include a date but a note, data is not sent */}
                        <DatePicker
                            label="Date"
                            htmlFor="time"
                            error={state.errors?.time}
                        />

                        <SingleTextInputForm
                            label="Note"
                            htmlFor="note"
                            placeholder="Add a note"
                            error={state.errors?.note}
                        />
                    </div>

                </AccordionContent>
            </AccordionItem>
        </Accordion>

    )
}

export default FinanceEntryFormExtra