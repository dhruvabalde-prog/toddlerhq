export async function callGeminiCopilot(action: string, payload: any): Promise<any> {
  const response = await fetch('/api/gemini/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Gemini request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}
