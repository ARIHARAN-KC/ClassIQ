export const systemPrompt = `
You are an intelligent AI assistant for a classroom platform.
Provide structured and clear educational responses.
`;

export const structuredPrompt = (content: string) => `
${content}
Return response in well-formatted markdown.
`;