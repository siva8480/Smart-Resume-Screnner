import { ALL_SKILLS_MAP, POWER_ACTION_VERBS, WEAK_PHRASES } from './skillTaxonomy.js';

export function extractSkills(text) {
  const result = new Map();
  if (!text) return result;

  const normalizedText = " " + text.toLowerCase().replace(/[\r\n\t]/g, " ") + " ";

  for (const [lookupKey, meta] of ALL_SKILLS_MAP.entries()) {
    const escaped = lookupKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?:^|[^a-zA-Z0-9_#+.-])${escaped}(?:$|[^a-zA-Z0-9_#+.-])`, 'gi');
    const matches = normalizedText.match(pattern);
    
    if (matches && matches.length > 0) {
      const existing = result.get(meta.standardName);
      if (existing) {
        existing.count += matches.length;
      } else {
        result.set(meta.standardName, {
          standardName: meta.standardName,
          category: meta.category,
          count: matches.length
        });
      }
    }
  }

  return result;
}

export function extractBullets(text) {
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const bullets = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const isBulletLine = /^([•\-\*▪➢►–—]|\d+[\.\)])\s*(.+)/i.test(line);
    
    if (isBulletLine) {
      const cleanLine = line.replace(/^([•\-\*▪➢►–—]|\d+[\.\)])\s*/, '').trim();
      if (cleanLine.length > 20) {
        bullets.push(cleanLine);
      }
    } else if (line.length > 35 && line.length < 250 && !line.endsWith(':')) {
      const firstWord = line.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      if (POWER_ACTION_VERBS.has(firstWord) || WEAK_PHRASES.some(wp => line.toLowerCase().startsWith(wp))) {
        bullets.push(line);
      }
    }
  }

  if (bullets.length < 3) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    for (const s of sentences) {
      const clean = s.trim();
      if (clean.length > 35 && clean.length < 250) {
        bullets.push(clean);
      }
    }
  }

  return bullets.slice(0, 15);
}

export function analyzeBullet(bullet, index) {
  const clean = bullet.trim();
  const lower = clean.toLowerCase();
  const words = lower.split(/\s+/);
  const firstWord = words[0]?.replace(/[^a-z]/g, '') || '';

  let hasActionVerb = POWER_ACTION_VERBS.has(firstWord);
  let actionVerb = hasActionVerb ? firstWord : undefined;

  if (!hasActionVerb) {
    for (let i = 0; i < Math.min(3, words.length); i++) {
      const w = words[i].replace(/[^a-z]/g, '');
      if (POWER_ACTION_VERBS.has(w)) {
        hasActionVerb = true;
        actionVerb = w;
        break;
      }
    }
  }

  const metricRegex = /(\b\d+[\d,.]*\b|\b\d+%\b|\$\d+[\d,.]*|\b\d+x\b|\b\d+\s*(?:k|m|million|billion|users|clients|engineers|team members|qps|ms|fps)\b)/gi;
  const metricsMatches = clean.match(metricRegex) || [];
  const hasQuantifiableMetric = metricsMatches.length > 0;

  let hasWeakPhrase = false;
  let weakPhraseFound = undefined;
  for (const wp of WEAK_PHRASES) {
    if (lower.includes(wp)) {
      hasWeakPhrase = true;
      weakPhraseFound = wp;
      break;
    }
  }

  let score = 40;
  if (hasActionVerb) score += 30;
  if (hasQuantifiableMetric) score += 30;
  if (hasWeakPhrase) score -= 25;
  if (clean.length < 40) score -= 15;
  if (clean.length >= 70 && clean.length <= 160) score += 10;

  score = Math.max(10, Math.min(100, score));

  let rating = 'Moderate';
  if (score >= 80) rating = 'Strong';
  else if (score <= 50) rating = 'Weak';

  let suggestion = 'Solid bullet point.';
  let improvedExample = clean;

  if (hasWeakPhrase && weakPhraseFound) {
    suggestion = `Replace passive phrase "${weakPhraseFound}" with a high-impact action verb like Spearheaded, Engineered, or Orchestrated.`;
    improvedExample = `Spearheaded ${clean.replace(new RegExp(weakPhraseFound, 'i'), '').trim()}, delivering measurable business efficiency.`;
  } else if (!hasActionVerb && !hasQuantifiableMetric) {
    suggestion = 'Start with a strong action verb (e.g., Developed, Optimized) and include numerical metrics (e.g., improved speed by 35%).';
    improvedExample = `Accelerated performance by 35% by re-architecting core pipeline: ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
  } else if (!hasQuantifiableMetric) {
    suggestion = 'Add measurable metrics: specify percentages, latency reduction, user volume, or scale.';
    improvedExample = `${clean} — resulting in a 25% increase in efficiency and reduced downtime.`;
  } else if (!hasActionVerb) {
    suggestion = 'Begin immediately with a power action verb to demonstrate execution and ownership.';
    improvedExample = `Engineered and delivered: ${clean}`;
  }

  return {
    id: `bullet-${index}`,
    text: clean,
    hasActionVerb,
    actionVerb,
    hasQuantifiableMetric,
    metricsFound: metricsMatches.slice(0, 3),
    hasWeakPhrase,
    weakPhraseFound,
    score,
    rating,
    suggestion,
    improvedExample
  };
}

// Deep Project Extraction & Technical Depth Evaluator for Freshers and Developers
export function analyzeProjectDepth(resumeText, jdText) {
  const projects = [];
  const lowerText = resumeText.toLowerCase();

  // Check if Projects section exists
  const projectSectionRegex = /(?:PROJECTS|ACADEMIC PROJECTS|KEY PROJECTS|PERSONAL PROJECTS|TECHNICAL PROJECTS)[\s\S]*?(?=(?:EDUCATION|EXPERIENCE|WORK HISTORY|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|$))/i;
  const projectSectionMatch = resumeText.match(projectSectionRegex);
  const projectBlock = projectSectionMatch ? projectSectionMatch[0] : '';

  // Split project blocks by common headers or bold titles
  const rawProjects = projectBlock
    ? projectBlock.split(/(?:\n{2,}|\n(?=[A-Z0-9\s|–—\-]{4,}(?:\(|\||–|—|-|\n)))/)
    : [];

  let extractedCount = 0;
  for (const p of rawProjects) {
    const trimmed = p.trim();
    if (trimmed.length > 50 && !/^(PROJECTS|ACADEMIC PROJECTS|KEY PROJECTS)/i.test(trimmed)) {
      extractedCount++;
      const lines = trimmed.split('\n').filter(l => l.trim().length > 0);
      const titleLine = lines[0] || `Project #${extractedCount}`;
      
      // Extract skills from this project block
      const projectSkills = extractSkills(trimmed);
      const techStack = Array.from(projectSkills.values()).map(s => s.standardName);

      // Check for live demo link & github repo
      const hasLiveLink = /(https?:\/\/[^\s]+|\.vercel\.app|\.netlify\.app|\.render\.com|\.github\.io|\.herokuapp\.com)/i.test(trimmed);
      const hasGithubRepo = /(github\.com\/[^\s]+|gitlab\.com\/[^\s]+|git repo)/i.test(trimmed);

      // Check architecture depth keywords
      const architectureKeywords = [
        'api', 'database', 'rest', 'graphql', 'auth', 'jwt', 'oauth', 'state management',
        'redux', 'schema', 'pipeline', 'deployment', 'docker', 'cloud', 'scalable', 'crud',
        'cache', 'redis', 'websocket', 'full stack', 'backend', 'frontend'
      ];
      const matchedArch = architectureKeywords.filter(k => trimmed.toLowerCase().includes(k));
      const hasArchitectureDepth = matchedArch.length >= 2;

      // Check quantifiable metrics in project
      const metricRegex = /(\b\d+[\d,.]*\b|\b\d+%\b|\$\d+|\b\d+x\b|\b\d+\s*(?:users|qps|ms|fps|tests|stars)\b)/gi;
      const metricsFound = trimmed.match(metricRegex) || [];
      const hasQuantifiableImpact = metricsFound.length > 0;

      // Compute project score (0-100)
      let projectScore = 45;
      if (techStack.length >= 3) projectScore += 15;
      if (techStack.length >= 5) projectScore += 10;
      if (hasArchitectureDepth) projectScore += 15;
      if (hasLiveLink || hasGithubRepo) projectScore += 15;
      if (hasQuantifiableImpact) projectScore += 10;

      projectScore = Math.min(100, projectScore);

      let rating = 'Basic';
      if (projectScore >= 80) rating = 'Production-Ready';
      else if (projectScore >= 60) rating = 'Intermediate';

      const tips = [];
      if (!hasGithubRepo && !hasLiveLink) tips.push('Add a GitHub repository or live deployment link (e.g. Vercel/Netlify).');
      if (techStack.length < 3) tips.push('Explicitly list the tech stack (Frontend, Backend, Database).');
      if (!hasQuantifiableImpact) tips.push('Quantify the project outcome (e.g., users served, API latency, test coverage).');
      if (!hasArchitectureDepth) tips.push('Describe the architectural design (APIs, state management, database schema).');

      projects.push({
        id: `proj-${extractedCount}`,
        title: titleLine.replace(/^([•\-\*▪➢►–—]|\d+[\.\)])\s*/, '').trim().slice(0, 70),
        techStack: techStack.slice(0, 8),
        hasLiveLink,
        hasGithubRepo,
        hasArchitectureDepth,
        hasQuantifiableImpact,
        rating,
        score: projectScore,
        tips: tips.slice(0, 2),
        summary: trimmed.slice(0, 200) + (trimmed.length > 200 ? '...' : '')
      });
    }
  }

  // Fallback: If standard project section wasn't segmented, extract general project references
  if (projects.length === 0) {
    const generalSkills = extractSkills(resumeText);
    const techStack = Array.from(generalSkills.values()).map(s => s.standardName).slice(0, 6);
    const hasGithub = /(github\.com|gitlab|portfolio)/i.test(resumeText);

    projects.push({
      id: 'proj-1',
      title: 'Full-Stack Technical Project Portfolio',
      techStack,
      hasLiveLink: /(https?:\/\/[^\s]+|\.vercel\.app|\.netlify\.app)/i.test(resumeText),
      hasGithubRepo: hasGithub,
      hasArchitectureDepth: techStack.length >= 3,
      hasQuantifiableImpact: false,
      rating: techStack.length >= 4 ? 'Intermediate' : 'Basic',
      score: techStack.length >= 4 ? 65 : 45,
      tips: [
        'Organize projects under a dedicated "PROJECTS" section with 2-3 bullet points per project.',
        'Include GitHub repository links and live URLs to showcase your code to recruiters.'
      ],
      summary: 'Project details extracted from general technical highlights.'
    });
  }

  // Calculate overall Project Depth Score (0-100)
  const totalProjScore = projects.reduce((acc, p) => acc + p.score, 0);
  const avgProjScore = Math.round(totalProjScore / projects.length);
  
  let depthScore = avgProjScore;
  if (projects.length >= 2) depthScore = Math.min(100, depthScore + 10);
  if (projects.some(p => p.hasLiveLink || p.hasGithubRepo)) depthScore = Math.min(100, depthScore + 10);

  return {
    projects,
    projectCount: projects.length,
    overallDepthScore: Math.min(100, depthScore),
    hasGithubOrLiveLinks: projects.some(p => p.hasLiveLink || p.hasGithubRepo),
    productionReadyCount: projects.filter(p => p.rating === 'Production-Ready').length
  };
}

export function auditATSHealth(resumeText) {
  const issues = [];
  const strengths = [];

  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
  const emailMatch = resumeText.match(emailRegex);
  const hasEmail = !!emailMatch;
  if (hasEmail) strengths.push(`Contact email detected (${emailMatch[0]})`);
  else issues.push('No contact email address found in resume.');

  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = resumeText.match(phoneRegex);
  const hasPhone = !!phoneMatch;
  if (hasPhone) strengths.push('Phone number detected for recruiter contact');
  else issues.push('No telephone number detected.');

  const linkedinRegex = /(linkedin\.com\/in\/[\w-]+|linkedin)/i;
  const hasLinkedIn = linkedinRegex.test(resumeText);
  if (hasLinkedIn) strengths.push('LinkedIn profile link detected');
  else issues.push('Consider adding your LinkedIn profile URL.');

  const githubRegex = /(github\.com\/[\w-]+|gitlab|portfolio|behance)/i;
  const hasGitHub = githubRegex.test(resumeText);
  if (hasGitHub) strengths.push('Portfolio/GitHub link detected');

  const locationRegex = /\b(remote|hybrid|new york|san francisco|london|toronto|bangalore|hyderabad|seattle|austin|chicago|boston|berlin|singapore|dubai|india|usa|uk|canada)\b/i;
  const hasLocation = locationRegex.test(resumeText);

  const standardSections = [
    { name: 'Projects', regex: /\b(projects|key projects|academic projects|personal projects)\b/i },
    { name: 'Experience', regex: /\b(experience|work history|employment|internships|internship)\b/i },
    { name: 'Education', regex: /\b(education|academic background|degree|university|b\.tech|bachelor)\b/i },
    { name: 'Skills', regex: /\b(skills|technical skills|technologies|competencies|tools)\b/i },
    { name: 'Summary', regex: /\b(summary|professional summary|profile|about me|objective)\b/i }
  ];

  const foundSections = [];
  const missingStandardSections = [];

  for (const sec of standardSections) {
    if (sec.regex.test(resumeText)) {
      foundSections.push(sec.name);
    } else {
      missingStandardSections.push(sec.name);
    }
  }

  if (foundSections.includes('Projects')) strengths.push('Clear Projects section header detected');
  if (foundSections.includes('Skills')) strengths.push('Standard Skills section header detected');
  if (foundSections.includes('Education')) strengths.push('Standard Education section header detected');

  const words = resumeText.match(/\b[\w'-]+\b/g) || [];
  const wordCount = words.length;
  let wordCountScore = 100;

  if (wordCount < 250) {
    wordCountScore = 45;
    issues.push(`Resume text is very short (${wordCount} words). Aim for 450 - 800 words for optimal ATS parsing.`);
  } else if (wordCount < 380) {
    wordCountScore = 75;
    issues.push(`Resume word count is slightly lean (${wordCount} words).`);
  } else if (wordCount > 1300) {
    wordCountScore = 70;
    issues.push(`Resume might be too long (${wordCount} words). Consider condensing to 1-2 pages.`);
  } else {
    strengths.push(`Optimal resume length (${wordCount} words).`);
  }

  const bullets = extractBullets(resumeText);
  const bulletPointCount = bullets.length;
  if (bulletPointCount >= 5) {
    strengths.push(`Good use of bullet points (${bulletPointCount} identified) for ATS scannability`);
  } else {
    issues.push('Low number of bullet points detected. ATS parsers prefer structured bullet points over dense paragraphs.');
  }

  let score = 0;
  if (hasEmail) score += 20;
  if (hasPhone) score += 15;
  if (hasLinkedIn) score += 10;
  if (hasGitHub) score += 10;
  score += Math.min(25, foundSections.length * 5);
  score += Math.round((wordCountScore / 100) * 20);

  score = Math.min(100, score);

  return {
    hasEmail,
    email: emailMatch ? emailMatch[0] : undefined,
    hasPhone,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    hasLinkedIn,
    hasGitHub,
    hasLocation,
    foundSections,
    missingStandardSections,
    wordCount,
    wordCountScore,
    bulletPointCount,
    score,
    issues,
    strengths
  };
}

export function computeCosineRelevance(textA, textB) {
  const getTokens = (txt) => {
    return (txt.toLowerCase().match(/\b[a-z]{3,}\b/g) || []).filter(
      w => !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are', 'was', 'were', 'will', 'been'].includes(w)
    );
  };

  const tokensA = getTokens(textA);
  const tokensB = getTokens(textB);

  if (!tokensA.length || !tokensB.length) return 50;

  const freqA = {};
  const freqB = {};

  tokensA.forEach(t => freqA[t] = (freqA[t] || 0) + 1);
  tokensB.forEach(t => freqB[t] = (freqB[t] || 0) + 1);

  const allWords = new Set([...Object.keys(freqA), ...Object.keys(freqB)]);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const word of allWords) {
    const a = freqA[word] || 0;
    const b = freqB[word] || 0;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 50;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.min(100, Math.round(similarity * 150));
}

// Master ATS Screener supporting both Experienced Professionals & Freshers
export function runATSScreener(resumeText, jdText, profileMode = 'auto') {
  if (!resumeText.trim() || !jdText.trim()) {
    throw new Error('Both Resume and Job Description are required for screening.');
  }

  // 1. Fresher / Student Detection
  const fresherKeywords = [
    'fresher', 'student', 'graduate', 'b.tech', 'b.e.', 'bachelor', 'intern',
    'internship', 'academic', 'cgpa', 'expected graduation', 'entry level', 'junior'
  ];
  const isFresherByResume = fresherKeywords.some(kw => resumeText.toLowerCase().includes(kw));
  const isFresherByJd = /(fresher|entry level|junior|graduate|intern|0-1 years|0-2 years|college)/i.test(jdText);
  
  let isFresher = profileMode === 'fresher' 
    ? true 
    : profileMode === 'experienced' 
    ? false 
    : (isFresherByResume || isFresherByJd);

  // 2. Skill Extraction
  const resumeSkillsMap = extractSkills(resumeText);
  const jdSkillsMap = extractSkills(jdText);

  const matchedSkills = [];
  const missingSkills = [];
  const extraSkills = [];

  let criticalMissingCount = 0;
  let totalJdSkillPoints = 0;
  let matchedJdSkillPoints = 0;

  let hardSkillsTotal = 0;
  let hardSkillsMatched = 0;
  let softSkillsTotal = 0;
  let softSkillsMatched = 0;

  const categoryMap = {};

  for (const [skillName, jdData] of jdSkillsMap.entries()) {
    const isSoft = jdData.category === 'Soft Skills & Leadership';
    const isFound = resumeSkillsMap.has(skillName);
    const resumeCount = resumeSkillsMap.get(skillName)?.count || 0;

    let priority = 'Recommended';
    if (jdData.count >= 2 || /require|must|essential|expert|senior/i.test(jdText.substring(Math.max(0, jdText.indexOf(skillName) - 40), jdText.indexOf(skillName) + 40))) {
      priority = 'Critical';
    }

    const weight = priority === 'Critical' ? 3 : 1;
    totalJdSkillPoints += weight;

    if (isFound) {
      matchedJdSkillPoints += weight;
      matchedSkills.push({
        name: skillName,
        category: jdData.category,
        countInJd: jdData.count,
        countInResume: resumeCount,
        isFound: true,
        priority
      });
    } else {
      if (priority === 'Critical') criticalMissingCount++;
      missingSkills.push({
        name: skillName,
        category: jdData.category,
        countInJd: jdData.count,
        countInResume: 0,
        isFound: false,
        priority
      });
    }

    if (isSoft) {
      softSkillsTotal += weight;
      if (isFound) softSkillsMatched += weight;
    } else {
      hardSkillsTotal += weight;
      if (isFound) hardSkillsMatched += weight;
    }

    if (!categoryMap[jdData.category]) {
      categoryMap[jdData.category] = { total: 0, matched: 0 };
    }
    categoryMap[jdData.category].total += 1;
    if (isFound) {
      categoryMap[jdData.category].matched += 1;
    }
  }

  for (const [skillName, resData] of resumeSkillsMap.entries()) {
    if (!jdSkillsMap.has(skillName)) {
      extraSkills.push({
        name: skillName,
        category: resData.category,
        countInJd: 0,
        countInResume: resData.count,
        isFound: true,
        priority: 'Bonus'
      });
    }
  }

  const categoryScores = Object.entries(categoryMap).map(([category, stats]) => ({
    category,
    totalInJd: stats.total,
    matchedCount: stats.matched,
    percentage: Math.round((stats.matched / stats.total) * 100)
  }));

  const hardSkillsScore = hardSkillsTotal > 0 
    ? Math.round((hardSkillsMatched / hardSkillsTotal) * 100) 
    : 80;
  
  const softSkillsScore = softSkillsTotal > 0 
    ? Math.round((softSkillsMatched / softSkillsTotal) * 100) 
    : 85;

  // 3. Project Depth Analysis (Critical for Freshers)
  const projectDepth = analyzeProjectDepth(resumeText, jdText);

  // 4. Experience Evaluation (Only heavy for experienced candidates)
  const jdExpMatch = jdText.match(/(\d+)\+?\s*(?:years|yrs)/i);
  const jdYearsRequired = jdExpMatch ? parseInt(jdExpMatch[1], 10) : undefined;

  const resumeExpMatch = resumeText.match(/(\d+)\+?\s*(?:years|yrs)/i);
  const resumeYearsDetected = resumeExpMatch ? parseInt(resumeExpMatch[1], 10) : undefined;

  let experienceScore = 80;
  let isExperienceMet = true;

  if (isFresher) {
    // For freshers, experience is evaluated on Project Depth & Internships rather than years!
    experienceScore = projectDepth.overallDepthScore;
    isExperienceMet = projectDepth.overallDepthScore >= 65;
  } else if (jdYearsRequired && resumeYearsDetected) {
    if (resumeYearsDetected >= jdYearsRequired) {
      experienceScore = 95;
      isExperienceMet = true;
    } else {
      experienceScore = Math.max(50, Math.round((resumeYearsDetected / jdYearsRequired) * 85));
      isExperienceMet = false;
    }
  }

  // 5. ATS Health & Semantic Relevance
  const atsHealth = auditATSHealth(resumeText);
  const atsFormatScore = atsHealth.score;
  const relevanceScore = computeCosineRelevance(resumeText, jdText);

  // 6. Multi-Factor Weighted ATS Score Calculation
  let overallScore;
  if (isFresher) {
    // Fresher Weights: Hard Skills (35%), Project Depth (25%), Soft Skills (15%), ATS Format (15%), Relevance (10%)
    overallScore = Math.round(
      hardSkillsScore * 0.35 +
      projectDepth.overallDepthScore * 0.25 +
      softSkillsScore * 0.15 +
      atsFormatScore * 0.15 +
      relevanceScore * 0.10
    );
  } else {
    // Experienced Weights: Hard Skills (35%), Experience (20%), Project Depth (15%), Soft Skills (15%), ATS Format (15%)
    overallScore = Math.round(
      hardSkillsScore * 0.35 +
      experienceScore * 0.20 +
      projectDepth.overallDepthScore * 0.15 +
      softSkillsScore * 0.15 +
      atsFormatScore * 0.15
    );
  }

  overallScore = Math.max(15, Math.min(100, overallScore));

  let scoreGrade = 'A+ (Exceptional ATS Match)';
  let scoreColor = '#10B981';
  if (overallScore < 50) {
    scoreGrade = 'Needs Significant Optimization';
    scoreColor = '#EF4444';
  } else if (overallScore < 68) {
    scoreGrade = 'C (Moderate Match - Action Required)';
    scoreColor = '#F59E0B';
  } else if (overallScore < 80) {
    scoreGrade = 'B (Good Match - Minor Tweaks Needed)';
    scoreColor = '#3B82F6';
  } else if (overallScore < 90) {
    scoreGrade = 'A (Strong Match - Interview Ready)';
    scoreColor = '#06B6D4';
  }

  const bullets = extractBullets(resumeText);
  const bulletAnalysis = bullets.map((b, i) => analyzeBullet(b, i));

  const topKeywords = [];
  for (const [sName, sData] of jdSkillsMap.entries()) {
    topKeywords.push({
      word: sName,
      countInJd: sData.count,
      countInResume: resumeSkillsMap.get(sName)?.count || 0
    });
  }
  topKeywords.sort((a, b) => b.countInJd - a.countInJd);

  // Strategic Recommendations tailored to Fresher vs Experienced
  const summaryRecommendations = [];
  if (criticalMissingCount > 0) {
    summaryRecommendations.push(`Add the ${criticalMissingCount} missing critical keywords (${missingSkills.filter(s => s.priority === 'Critical').slice(0, 3).map(s => s.name).join(', ')}) to your Skills and Project descriptions.`);
  }

  if (isFresher) {
    if (projectDepth.productionReadyCount === 0) {
      summaryRecommendations.push('Elevate your Projects: Recruiters look for full-stack depth (Database schema, APIs, live deployment links, GitHub repos).');
    }
    if (!projectDepth.hasGithubOrLiveLinks) {
      summaryRecommendations.push('Add live links (Vercel/Netlify) and GitHub URLs next to each project title to verify hands-on execution.');
    }
  } else {
    if (!isExperienceMet && jdYearsRequired) {
      summaryRecommendations.push(`Emphasize high-scale project delivery to bridge the ${jdYearsRequired}+ years experience requirement.`);
    }
  }

  if (atsHealth.issues.length > 0) {
    summaryRecommendations.push(atsHealth.issues[0]);
  }

  const weakBullets = bulletAnalysis.filter(b => b.rating === 'Weak' || !b.hasQuantifiableMetric);
  if (weakBullets.length > 0) {
    summaryRecommendations.push(`Quantify project impact: ${weakBullets.length} bullet points lack measurable numbers, percentages, or scale.`);
  }

  return {
    isFresher,
    overallScore,
    scoreGrade,
    scoreColor,
    breakdown: {
      hardSkillsScore,
      softSkillsScore,
      experienceScore,
      projectDepthScore: projectDepth.overallDepthScore,
      atsFormatScore,
      relevanceScore
    },
    projectDepth,
    skills: {
      matched: matchedSkills.sort((a, b) => b.countInJd - a.countInJd),
      missing: missingSkills.sort((a, b) => (b.priority === 'Critical' ? 1 : 0) - (a.priority === 'Critical' ? 1 : 0)),
      extra: extraSkills.slice(0, 20),
      criticalMissingCount,
      categoryScores
    },
    bulletAnalysis,
    atsHealth,
    experienceMatch: {
      jdYearsRequired,
      resumeYearsDetected,
      seniorityMatch: isFresher ? 'Evaluated on Project Depth & CS Skills' : isExperienceMet ? 'Requirements Met' : 'Gap Detected',
      isExperienceMet
    },
    topKeywords: topKeywords.slice(0, 10),
    summaryRecommendations
  };
}

export const runATSScanner = runATSScreener;
