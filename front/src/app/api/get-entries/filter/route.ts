export async function POST(req: Request) {
    try {
        const { userId, expenseFilter } = await req.json();

        if (!userId || expenseFilter === undefined) {
            throw new Error("Invalid request, missing required fields.");
        }
        const url = process.env.NEXT_PUBLIC_PANDORA_API_ENDPOINT;
        const response = await fetch(`${url}/get-expenses-range/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(expenseFilter),
        });

        if (!response.ok) {
            throw new Error("Failed to process expenses filter request.");
        }

        return new Response(
            JSON.stringify(await response.json()),
            { status: response.status }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500 }
        )
    }

}