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

import { logger } from './logger';

const ENV_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
// User provided key as fallback
const API_KEY = ENV_API_KEY || '';

if (!API_KEY) {
    logger.warn('⚠️ OpenRouter API Key is missing. AI features will not work.');
}

// Use the specific free model requested by user as primary
const PRIMARY_MODEL = 'google/gemma-3n-e2b-it:free';
// const FALLBACK_MODEL = 'google/gemini-2.0-flash-lite-preview-02-05:free';
// const FALLBACK_MODEL_2 = 'meta-llama/llama-3.1-8b-instruct:free';

/**
 * Makes a request to OpenRouter AI API with fallback support
 */
async function callAI(messages: any[], enableReasoning = false): Promise<AIResponse> {
    const makeRequest = async (model: string) => {
        if (!API_KEY) {
            throw new Error('OpenRouter API Key is missing. Please add VITE_OPENROUTER_API_KEY to your .env file.');
        }

        // Debug log to verify configuration
        logger.log(`🤖 AI Request Details:
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
            logger.error('❌ AI API Failed:', {
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

        // Log reasoning if enabled and available
        if (enableReasoning && result.choices[0].message.reasoning_details) {
            logger.log('🤔 AI Reasoning:', result.choices[0].message.reasoning_details);
        }

        return {
            content: result.choices[0].message.content,
            reasoning_details: result.choices[0].message.reasoning_details,
        };
    } catch (error) {
        logger.error('❌ AI model failed:', error);
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
    const systemPrompt = `You are LANCE, a professional Resume Writer and Career Coach. Your goal is to help the user create a resume with the highest possible ATS score, completely free and hassle-free.
  
  Persona:
  - Name: LANCE
  - Role: Expert Resume Strategist & ATS Specialist
  - Tone: Professional, Encouraging, Efficient, and Insightful.
  - Objective: Gather exact details to build a top-tier resume.

  AVAILABLE FEATURES (mention these to users when relevant):
  
  1. PRESET TEMPLATES:
     - Classic: Clean, traditional single-column format
     - Executive: Bold headers with professional styling
     - Minimal: Simple and modern minimalist design
     - Creative: Unique layout with accent colors
     - Corporate: Two-column professional format
  
  2. CANVAS EDITING MODE (Selection Mode):
     - Users can click "Select" button to enter editing mode
     - In this mode, users can:
       • Click any text element to select it
       • Shift+Click to select multiple elements
       • Press Delete/Backspace to hide elements they don't want
       • Drag the Move icon to reposition elements anywhere
       • Click "Restore" to bring back hidden elements
       • Click "Format" to change text styles (bold, italic, color, size)
     - All changes persist after page refresh
  
  3. CUSTOM LAYOUTS:
     - If user wants a custom design, explain they can:
       • Start with any preset template
       • Use Selection Mode to move elements around
       • Delete sections they don't need
       • Customize colors and fonts using the toolbar
     - For truly custom designs, gather their layout preferences and I'll provide guidance

  Process:
  1. Introduce yourself as LANCE and mention your goal (high ATS score, free service).
  2. Briefly mention that they can choose preset templates OR customize the layout with our editing tools.
  3. Ask for their Personal Info (Name, Role, Location).
  4. Then move to Experience (Companies, Roles, Dates, Impacts).
  5. Then Education.
  6. Then Skills.
  7. Ask about template preference (preset or custom - explain the options if they ask).
  8. Finally, ask if they want to add anything else.

  Rules:
  - Ask ONE question at a time. Do not overwhelm the user.
  - Be encouraging and professional.
  - If the user gives a short answer, ask a follow-up to get more detail (e.g., "What tools did you use?" or "What was the result of that project?").
  - When users ask about customization, explain the canvas editing features.
  - Keep your responses concise. 
  
  Start by introducing yourself, briefly mention the customization options, and asking for their name and target job title.`;

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
        logger.error("Failed to parse AI extraction:", e);
        logger.log("Raw output:", response.content);

        // Final attempt: aggressive clean up
        try {
            // Remove any control characters that might break JSON
            const cleanStr = jsonStr.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
            return JSON.parse(cleanStr);
        } catch (retryError) {
            logger.error('AI Extraction Failed. Raw response:', response.content);
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
        logger.error("Failed to parse AI extraction:", e);
        // Fallback or retry logic could go here
        throw new Error("Failed to parse resume data from AI response.");
    }
}

/**
 * Generate a custom template configuration based on user preferences
 */
export interface TemplatePreferences {
    layout?: 'single-column' | 'two-column' | 'sidebar-left' | 'sidebar-right';
    colorScheme?: 'professional' | 'modern' | 'creative' | 'minimal' | 'dark' | 'custom';
    customColors?: { primary?: string; secondary?: string; background?: string };
    industry?: string;
    style?: 'formal' | 'casual' | 'creative' | 'technical';
    sections?: string[];
    sidebarSections?: string[];
}

export async function generateTemplateConfig(preferences: TemplatePreferences): Promise<any> {
    const prompt = `Generate a resume template configuration JSON based on these preferences:

Layout: ${preferences.layout || 'auto-choose based on industry'}
Color Scheme: ${preferences.colorScheme || 'professional'}
${preferences.customColors ? `Custom Colors: ${JSON.stringify(preferences.customColors)}` : ''}
Industry: ${preferences.industry || 'general'}
Style: ${preferences.style || 'professional'}
${preferences.sections ? `Sections to include: ${preferences.sections.join(', ')}` : ''}
${preferences.sidebarSections ? `Sidebar sections: ${preferences.sidebarSections.join(', ')}` : ''}

Generate a complete template configuration JSON with this EXACT structure:
{
  "id": "ai-generated",
  "name": "string (descriptive name)",
  "layout": "single-column" | "two-column" | "sidebar-left" | "sidebar-right",
  "sections": [
    { "type": "personal" | "summary" | "experience" | "education" | "skills" | "languages" | "certifications", "visible": true/false, "order": number, "inSidebar": true/false }
  ],
  "colors": {
    "primary": "hex color",
    "secondary": "hex color", 
    "background": "hex color",
    "headerBg": "hex color",
    "text": "hex color",
    "textMuted": "hex color"
  },
  "typography": {
    "fontFamily": "font stack",
    "headingFontFamily": "font stack",
    "baseFontSize": number,
    "headingScale": number
  },
  "spacing": {
    "sectionGap": number,
    "itemGap": number,
    "padding": number
  },
  "headerStyle": "centered" | "left-aligned" | "split" | "minimal",
  "showPhoto": true/false,
  "sidebarWidth": number (20-40)
}

Rules:
- Return ONLY the valid JSON object, no explanations
- Choose colors that are professional and ATS-friendly
- For creative industries, use more vibrant colors
- For corporate/technical, use more muted professional colors
- Include all standard sections unless user specified otherwise
- For two-column layouts, put skills/languages/certifications in sidebar`;

    const response = await callAI([
        { role: 'user', content: prompt }
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
        logger.error("Failed to parse template config:", e);
        // Return a safe default
        return {
            id: 'ai-generated',
            name: 'Custom Template',
            layout: preferences.layout || 'single-column',
            sections: [
                { type: 'personal', visible: true, order: 0, inSidebar: false },
                { type: 'summary', visible: true, order: 1, inSidebar: false },
                { type: 'experience', visible: true, order: 2, inSidebar: false },
                { type: 'education', visible: true, order: 3, inSidebar: false },
                { type: 'skills', visible: true, order: 4, inSidebar: false },
            ],
            colors: {
                primary: '#2563eb',
                secondary: '#7c3aed',
                background: '#ffffff',
                headerBg: '#f8fafc',
                text: '#1f2937',
                textMuted: '#6b7280',
            },
            typography: {
                fontFamily: 'Inter, system-ui, sans-serif',
                headingFontFamily: 'Inter, system-ui, sans-serif',
                baseFontSize: 14,
                headingScale: 1.25,
            },
            spacing: { sectionGap: 24, itemGap: 12, padding: 40 },
            headerStyle: 'centered',
            showPhoto: true,
            sidebarWidth: 35,
        };
    }
}
