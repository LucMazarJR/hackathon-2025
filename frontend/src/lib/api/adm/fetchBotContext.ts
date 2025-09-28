export const fetchContext = async (instructions: string) => {
  try {
    // amazonq-ignore-next-line
    const result = await fetch(`http://localhost:3000/admin/context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ context: instructions }),
    });
    return result.json();
  } catch (error) {
    return error;
  }
}