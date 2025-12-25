interface AIGenerationOptions {
    role?: string;
    yearsOfExperience?: number;
    industry?: string;
    skills?: string[];
    goals?: string;
}

interface ExperienceDetails {
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    responsibilities?: string;
}

interface AIResponse {
    content: string;
    reasoning_details?: any;
}

const ENV_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
// User provided key as fallback
const API_KEY = ENV_API_KEY || '';

// Use the specific free model requested by user as primary
const PRIMARY_MODEL = 'google/gemma-3n-e2b-it:free';
// const FALLBACK_MODEL = 'google/gemini-2.0-flash-lite-preview-02-05:free';
// const FALLBACK_MODEL_2 = 'meta-llama/llama-3.1-8b-instruct:free';

/**
 * Makes a request to OpenRouter AI API with fallback support
 */
async function callAI(messages: any[], enableReasoning = false): Promise<AIResponse> {
    const makeRequest = async (model: string) => {
        // Debug log to verify configuration
        console.log(`🤖 AI Request Details:
      Model: ${model}
      API Key Loaded: ${!!API_KEY}
    `);

        const cleanModel = model.trim();

        // Sanitize messages for Gemma 3 (does not support system prompts)
        let sanitizedMessages = [...messages];

        // 1. Handle system messages
        const systemMessageIndex = sanitizedMessages.findIndex(msg => msg.role === 'system');
        if (systemMessageIndex !== -1) {
            const systemContent = sanitizedMessages[systemMessageIndex].content;
            sanitizedMessages.splice(systemMessageIndex, 1);

            // Find first user message to prepend system content
            const firstUserIndex = sanitizedMessages.findIndex(msg => msg.role === 'user');
            if (firstUserIndex !== -1) {
                sanitizedMessages[firstUserIndex].content = `${systemContent}\n\n${sanitizedMessages[firstUserIndex].content}`;
            } else {
                // No user message, create one
                sanitizedMessages.unshift({
                    role: 'user',
                    content: systemContent
                });
            }
        }

        // 2. Ensure conversation starts with user (Gemma requirement)
        if (sanitizedMessages.length > 0 && sanitizedMessages[0].role === 'assistant') {
            sanitizedMessages.unshift({
                role: 'user',
                content: 'Start interview'
            });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Resume Builder',
            },
            body: JSON.stringify({
                model: cleanModel,
                messages: sanitizedMessages,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ AI API Failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    };

    try {
        // Try primary model
        const result = await makeRequest(PRIMARY_MODEL);
        return {
            content: result.choices[0].message.content,
            reasoning_details: result.choices[0].message.reasoning_details,
        };
    } catch (error) {
        console.error('❌ AI model failed:', error);
        throw new Error(`AI Request failed: ${(error as Error).message}`);
    }
}

/**
 * Generate a professional summary based on user's career information
 */
export async function generateProfessionalSummary(options: AIGenerationOptions): Promise<string> {
    const { role = 'Professional', yearsOfExperience = 0, industry = '', skills = [], goals = '' } = options;

    const prompt = `Generate a professional summary for a resume with the following details:

Role: ${role}
Years of Experience: ${yearsOfExperience}
Industry: ${industry}
Key Skills: ${skills.join(', ')}
Career Goals: ${goals}

Requirements:
- 100-150 words in length
- ATS-optimized with relevant keywords from the role and industry
- Highlight key expertise and achievements
- Professional and compelling tone
- Focus on value proposition to employers
- Do NOT use first person pronouns (I, me, my)
- Write in third person or implied subject

Return ONLY the professional summary text, no additional formatting or explanations.`;

    const response = await callAI([
        {
            role: 'user',
            content: prompt,
        },
    ]);

    return response.content.trim();
}

/**
 * Generate detailed job description for work experience
 */
export async function generateExperienceDescription(details: ExperienceDetails): Promise<string> {
    const { position, company, startDate, endDate, responsibilities = '' } = details;

    const prompt = `Generate a professional job description for this work experience:

Position: ${position}
Company: ${company}
Duration: ${startDate} to ${endDate}
${responsibilities ? `Key Responsibilities/Context: ${responsibilities}` : ''}

Requirements:
- Generate 3-5 bullet points (each 50-100 words)
- Start each bullet with strong action verbs (Led, Developed, Implemented, etc.)
- Include quantifiable achievements where applicable (use realistic percentages/numbers)
- Use industry-specific keywords for ATS optimization
- Professional and impactful language
- Focus on accomplishments, not just duties

Return ONLY the bullet points, one per line, starting with "•". No additional text or explanations.`;

    const response = await callAI([
        {
            role: 'user',
            content: prompt,
        },
    ]);

    return response.content.trim();
}

/**
 * Suggest relevant skills based on role and industry
 */
export async function suggestSkills(role: string, industry: string, experienceLevel: string = 'intermediate'): Promise<string[]> {
    const prompt = `Suggest 12-15 relevant professional skills for this profile:

Role: ${role}
Industry: ${industry}
Experience Level: ${experienceLevel}

Requirements:
- Mix of technical skills (60%) and soft skills (40%)
- Industry-relevant and role-specific
- ATS-optimized keywords
- Modern and in-demand skills
- Appropriate for the experience level

Return ONLY a comma-separated list of skills, no explanations or additional text.`;

    const response = await callAI([
        {
            role: 'user',
            content: prompt,
        },
    ]);

    // Parse comma-separated skills
    return response.content
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)
        .slice(0, 15); // Limit to 15 skills
}

/**
 * Improve existing content for better ATS optimization and impact
 */
export async function improveContent(content: string, context: string = ''): Promise<string> {
    const prompt = `Improve the following resume content for better ATS optimization and impact:

Content to Improve:
${content}

${context ? `Context: ${context}` : ''}

Requirements:
- Enhance clarity and impact
- Add relevant keywords for ATS
- Improve grammar and flow
- Make it more compelling
- Keep the same length (±20%)
- Maintain professional tone

Return ONLY the improved content, no explanations.`;

    const response = await callAI([
        {
            role: 'user',
            content: prompt,
        },
    ]);

    return response.content.trim();
}

/**
 * Generate a complete resume based on minimal user input
 */
export async function generateCompleteResume(userInfo: {
    fullName: string;
    role: string;
    yearsOfExperience: number;
    industry: string;
    education?: string;
}): Promise<{
    summary: string;
    skills: string[];
    experienceSuggestions: string;
}> {
    const { role, yearsOfExperience, industry } = userInfo;

    // Generate summary
    const summary = await generateProfessionalSummary({
        role,
        yearsOfExperience,
        industry,
    });

    // Suggest skills
    const skills = await suggestSkills(role, industry, yearsOfExperience > 5 ? 'senior' : 'intermediate');

    // Generate experience suggestions
    const experienceSuggestions = `Based on your role as ${role}, consider highlighting these types of experiences:
- Leadership and team management
- Key projects and their impact
- Technical or domain expertise
- Process improvements and innovations
- Cross-functional collaboration`;

    return {
        summary,
        skills,
        experienceSuggestions,
    };
}

/**
 * Start the interview process with a system prompt
 */
export async function startInterview(): Promise<string> {
    const systemPrompt = `You are an expert Resume Writer and Career Coach. Your goal is to interview the user to gather information for their ATS-optimized resume. 
  
  Process:
  1. Introduce yourself briefly and friendly.
  2. Ask for their Personal Info (Name, Role, Location).
  3. Then move to Experience (Companies, Roles, Dates, Impacts).
  4. Then Education.
  5. Then Skills.
  6. Finally, ask if they want to add anything else.

  Rules:
  - Ask ONE question at a time. Do not overwhelm the user.
  - Be encouraging and professional.
  - If the user gives a short answer, ask a follow-up to get more detail (e.g., "What tools did you use?" or "What was the result of that project?").
  - Keep your responses concise. 
  
  Start by introducing yourself and asking for their name and target job title.`;

    // Combine system prompt with user message for better compatibility with free models
    const combinedPrompt = `${systemPrompt}\n\nUser: Hi, let's start the interview.`;

    const response = await callAI([
        { role: 'user', content: combinedPrompt }
    ]);

    return response.content;
}

/**
 * Send a message in the interview conversation
 */
export async function sendMessage(history: any[], userMessage: string): Promise<string> {
    const messages = history.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    messages.push({ role: 'user', content: userMessage });

    const response = await callAI(messages);
    return response.content;
}

/**
 * Extract structured resume data from the chat history
 */
export async function extractResumeData(history: any[]): Promise<any> {
    const messages = history.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    const extractionPrompt = `
    Based on the conversation history above, extract all user information into a JSON object for a resume.
    
    The JSON structure MUST match this schema:
    {
      "personalInfo": {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "title": "string",
        "summary": "string"
      },
      "experience": [
        {
          "company": "string",
          "position": "string",
          "startDate": "string (YYYY-MM-DD)",
          "endDate": "string (YYYY-MM-DD)",
          "description": "string (bullet points)"
        }
      ],
      "education": [
        {
          "institution": "string",
          "degree": "string",
          "field": "string",
          "graduationDate": "string (YYYY-MM-DD)"
        }
      ],
      "skills": ["string"]
    }

    Rules:
    - Return ONLY the valid JSON object.
    - If specific dates aren't mentioned, use reasonable defaults like "2023-01-01".
    - Optimise descriptions for ATS (use action verbs).
    - If information is missing, leave it as empty string or empty array.
    - Do NOT include any markdown formatting or code blocks in the output.
    `;

    // Combine system prompt for extraction
    const combinedPrompt = `${extractionPrompt}\n\nConversation History:\n${JSON.stringify(messages)}`;

    const response = await callAI([
        { role: 'user', content: combinedPrompt }
    ]);

    let jsonStr = response.content;

    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');

    // Find the first { and last }
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }

    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse AI extraction:", e);
        console.log("Raw output:", response.content);

        // Final attempt: aggressive clean up
        try {
            // Remove any control characters that might break JSON
            const cleanStr = jsonStr.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
            return JSON.parse(cleanStr);
        } catch (retryError) {
            throw new Error("Failed to parse resume data. The AI output was not valid JSON. Please try again.");
        }
    }
}
/**
 * Extract structured resume data from raw text
 */
export async function extractDataFromText(text: string): Promise<any> {
    const extractionPrompt = `
    Extract resume information from the following text into a JSON object.
    
    The JSON structure MUST match this schema:
    {
      "personalInfo": {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "title": "string",
        "summary": "string"
      },
      "experience": [
        {
          "company": "string",
          "position": "string",
          "startDate": "string (YYYY-MM-DD)",
          "endDate": "string (YYYY-MM-DD)",
          "description": "string (bullet points)"
        }
      ],
      "education": [
        {
          "institution": "string",
          "degree": "string",
          "field": "string",
          "graduationDate": "string (YYYY-MM-DD)"
        }
      ],
      "skills": ["string"],
      "languages": [{"language": "string", "proficiency": "string"}],
      "certifications": [{"name": "string", "issuer": "string", "date": "string"}]
    }

    Resume Text:
    ${text.substring(0, 15000)} // Limit text length

    Rules:
    - Return ONLY the valid JSON object.
    - Infer missing dates if reasonable, otherwise empty string.
    - Be precise with extraction.
    `;

    const response = await callAI([
        { role: 'user', content: extractionPrompt }
    ]);

    let jsonStr = response.content;
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');

    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }

    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse AI extraction:", e);
        // Fallback or retry logic could go here
        throw new Error("Failed to parse resume data from AI response.");
    }
}
