async function listModels() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY is not set.');
    return;
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!res.ok) {
      console.error(`HTTP Error: ${res.status} ${res.statusText}`);
      const body = await res.text();
      console.error('Response body:', body);
      return;
    }

    const data = await res.json();
    console.log('Available Models:');
    data.data.forEach((model: any) => {
      console.log(`- ${model.id} (Created by: ${model.owned_by})`);
    });
  } catch (error) {
    console.error('Request failed:', error);
  }
}

listModels();
