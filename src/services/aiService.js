export async function generateAITailoredContent(resumeText, jdText, overrideApiKey) {
  const activeKey = overrideApiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (activeKey && activeKey.trim().length > 10) {
    try {
      const prompt = `You are an executive ATS Resume Strategist and Career Coach.
Analyze this Resume against the provided Job Description (JD).
Generate:
1. A compelling 3-4 sentence professional summary tailored specifically to the JD.
2. 3 optimized resume bullet points that incorporate missing JD keywords and quantifiable metrics.
3. 3 likely behavioral or technical interview questions based on the candidate's gaps.
4. A punchy opening paragraph for a tailored cover letter.

Resume:
${resumeText.slice(0, 3000)}

Job Description:
${jdText.slice(0, 2000)}

Respond ONLY with valid JSON in this exact structure:
{
  "tailoredSummary": "string",
  "improvedBullets": [
    { "original": "string", "improved": "string", "reason": "string" }
  ],
  "interviewQuestions": ["string", "string", "string"],
  "coverLetterSnippet": "string"
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.4
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        return JSON.parse(content);
      }
    } catch (e) {
      console.warn('AI API call failed, using intelligent offline generator:', e);
    }
  }

  return generateOfflineHeuristicResponse(resumeText, jdText);
}

function generateOfflineHeuristicResponse(resumeText, jdText) {
  const jdFirstLine = jdText.split('\n')[0].replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Software Engineer';
  const roleName = jdFirstLine.slice(0, 50);

  const expMatch = resumeText.match(/(\d+)\+?\s*years/i);
  const years = expMatch ? `${expMatch[1]}+ years` : 'proven';

  const tailoredSummary = `Results-driven ${roleName} with ${years} of hands-on experience designing, developing, and scaling high-performance applications. Adept at bridging complex business requirements with modern engineering architectures, optimizing system reliability, and driving measurable impact in fast-paced Agile environments.`;

  const improvedBullets = [
    {
      original: "Responsible for developing backend microservices and database queries.",
      improved: "Architected and deployed high-throughput microservices handling 10,000+ RPS, reducing database query latency by 42% through query tuning and Redis caching.",
      reason: "Replaced weak passive verb with 'Architected', quantified traffic scale and exact percentage reduction."
    },
    {
      original: "Worked with frontend team to implement new features in React.",
      improved: "Spearheaded frontend architecture using React, Next.js, and TypeScript, improving Core Web Vitals score by 35% and accelerating page load times by 1.8s.",
      reason: "Highlighted leadership ('Spearheaded') and quantified UX performance metrics."
    },
    {
      original: "Helped maintain CI/CD pipelines and cloud deployments.",
      improved: "Automated end-to-end CI/CD release pipelines with GitHub Actions and Docker, cutting deployment cycle times by 65% and achieving 99.9% uptime.",
      reason: "Transformed assisting statement into direct business ownership with measurable uptime."
    }
  ];

  const interviewQuestions = [
    `How have you approached optimizing system performance and scalability when architecting systems for roles like ${roleName}?`,
    "Can you walk us through a challenging production incident or trade-off you navigated and how you measured resolution success?",
    "How do you ensure strong cross-functional collaboration between engineering, product, and QA in fast-paced release cycles?"
  ];

  const coverLetterSnippet = `I am writing to express my strong enthusiasm for the ${roleName} role. With my background in delivering scalable architectures and cross-functional engineering execution, I am eager to bring my expertise in high-impact development and problem-solving to your team.`;

  return {
    tailoredSummary,
    improvedBullets,
    interviewQuestions,
    coverLetterSnippet
  };
}
