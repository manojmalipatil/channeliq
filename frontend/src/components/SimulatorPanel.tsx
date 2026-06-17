export const triggerWhatsApp = async (index: number | null = null) => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${url}/simulate/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(index !== null ? { customer_index: index } : {})
    });
    return res.json();
}

export const triggerEmail = async (index: number | null = null) => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${url}/simulate/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(index !== null ? { customer_index: index } : {})
    });
    return res.json();
}

export const triggerJourney = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${url}/simulate/journey`, { method: "POST" });
    return res.json();
}

export const triggerBulk = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${url}/simulate/bulk`, { method: "POST" });
    return res.json();
}
