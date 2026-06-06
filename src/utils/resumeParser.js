// ─────────────────────────────────────────────────────────────
//  RESUME PARSER UTILITY (Rule-Based, No API Required)
// ─────────────────────────────────────────────────────────────

import { ALL_KEYWORDS, EXPERIENCE_KEYWORDS, LEARNING_STYLE_KEYWORDS, ROADMAP_PHASES } from '../data/roadmapData';

/**
 * Normalize text: lowercase, remove special chars, collapse spaces
 */
export function normalizeText(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Detect experience level from resume text
 */
export function detectExperienceLevel(text) {
  const normalized = normalizeText(text);

  // Try to extract years of experience
  const yearMatches = [...normalized.matchAll(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience)?/g)];
  let maxYears = 0;
  for (const match of yearMatches) {
    const y = parseInt(match[1]);
    if (y > maxYears && y < 50) maxYears = y;
  }

  if (maxYears >= 5) return { level: 'senior', years: maxYears };
  if (maxYears >= 2) return { level: 'mid', years: maxYears };
  if (maxYears >= 1) return { level: 'junior', years: maxYears };

  // Fallback to keyword detection
  for (const [level, keywords] of Object.entries(EXPERIENCE_KEYWORDS)) {
    if (keywords.some(kw => normalized.includes(kw))) {
      return { level, years: null };
    }
  }

  return { level: 'junior', years: null }; // default
}

/**
 * Extract skills from resume text by matching against roadmap keywords
 */
export function extractKnownSkills(text) {
  const normalized = normalizeText(text);
  const foundSkillIds = new Set();
  const foundPhaseIds = new Set();

  for (const { keyword, topicId, phaseId } of ALL_KEYWORDS) {
    if (normalized.includes(keyword.toLowerCase())) {
      foundSkillIds.add(topicId);
      foundPhaseIds.add(phaseId);
    }
  }

  return { knownTopicIds: [...foundSkillIds], knownPhaseIds: [...foundPhaseIds] };
}

/**
 * Extract domain / industry from resume
 */
export function extractDomain(text) {
  const normalized = normalizeText(text);
  const domains = {
    'Backend Development': ['node.js', 'express', 'django', 'fastapi', 'spring boot', 'java', 'go', 'rust', 'backend', 'api', 'microservices'],
    'Frontend Development': ['react', 'vue', 'angular', 'nextjs', 'frontend', 'ui', 'css', 'javascript', 'typescript', 'html'],
    'Data Engineering': ['spark', 'kafka', 'airflow', 'dbt', 'bigquery', 'snowflake', 'data pipeline', 'etl', 'data engineering'],
    'Machine Learning': ['machine learning', 'ml', 'tensorflow', 'pytorch', 'scikit-learn', 'model', 'training', 'nlp', 'deep learning'],
    'Networking / Infrastructure': ['cisco', 'network engineer', 'ccna', 'routing', 'switching', 'firewall', 'network admin'],
    'Security': ['security', 'penetration testing', 'soc analyst', 'siem', 'incident response', 'vulnerability'],
    'DevOps / Cloud': ['devops', 'cloud engineer', 'site reliability', 'sre', 'platform engineer', 'infrastructure engineer'],
    'Full Stack': ['full stack', 'fullstack', 'mean stack', 'mern stack', 'web developer']
  };

  const domainScores = {};
  for (const [domain, keywords] of Object.entries(domains)) {
    domainScores[domain] = keywords.filter(kw => normalized.includes(kw)).length;
  }

  const sorted = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[1] > 0 ? sorted[0][0] : 'General Engineering';
}

/**
 * Infer preferred learning style from resume
 */
export function inferLearningStyle(text) {
  const normalized = normalizeText(text);
  const scores = {};
  for (const [style, keywords] of Object.entries(LEARNING_STYLE_KEYWORDS)) {
    scores[style] = keywords.filter(kw => normalized.includes(kw)).length;
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[1] > 0 ? sorted[0][0] : 'handson'; // default to hands-on
}

/**
 * Extract education details
 */
export function extractEducation(text) {
  const normalized = normalizeText(text);
  const degrees = {
    'PhD': ['phd', 'doctorate', 'doctor of philosophy'],
    'Master\'s': ['master', 'msc', 'mtech', 'mba', 'me '],
    'Bachelor\'s': ['bachelor', 'bsc', 'btech', 'be ', 'bca', 'undergraduate'],
    'Diploma': ['diploma', 'polytechnic'],
    'High School': ['high school', '12th', 'secondary']
  };
  for (const [deg, keywords] of Object.entries(degrees)) {
    if (keywords.some(kw => normalized.includes(kw))) return deg;
  }
  return null;
}

/**
 * Extract name from resume text (heuristic: first line, title-cased)
 */
export function extractName(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 5)) {
    if (line.length < 60 && /^[A-Z][a-z]+ [A-Z]/.test(line)) {
      return line;
    }
  }
  return null;
}

/**
 * Main resume analysis function
 */
export function analyzeResume(resumeText) {
  const { level, years } = detectExperienceLevel(resumeText);
  const { knownTopicIds, knownPhaseIds } = extractKnownSkills(resumeText);
  const domain = extractDomain(resumeText);
  const learningStyle = inferLearningStyle(resumeText);
  const education = extractEducation(resumeText);
  const name = extractName(resumeText);

  // Build personalized roadmap
  const personalizedPhases = ROADMAP_PHASES.map(phase => {
    const topicsWithStatus = phase.topics.map(topic => {
      const known = knownTopicIds.includes(topic.id);
      const phaseKnown = knownPhaseIds.includes(phase.id);

      let status = 'todo'; // to-learn
      let priority = 'high';

      if (known) {
        status = 'known';
        priority = 'low';
      } else if (phaseKnown) {
        status = 'partial';
        priority = 'medium';
      }

      // Boost priority for domain-specific topics
      if (domain.includes('Backend') && ['kubernetes', 'cicd', 'terraform', 'monitoring'].includes(topic.id)) priority = 'high';
      if (domain.includes('Frontend') && ['docker', 'cicd', 'git'].includes(topic.id)) priority = 'high';
      if (domain.includes('Data') && ['aws', 'terraform', 'monitoring'].includes(topic.id)) priority = 'high';
      if (domain.includes('Security') && ['devsecops', 'kubernetes'].includes(topic.id)) priority = 'high';

      return { ...topic, status, priority, personalizedStyle: topic.teachingMethod[learningStyle] };
    });

    const phaseStatus = topicsWithStatus.every(t => t.status === 'known') ? 'known'
      : topicsWithStatus.some(t => t.status === 'known' || t.status === 'partial') ? 'partial'
      : 'todo';

    return { ...phase, topics: topicsWithStatus, phaseStatus };
  });

  // Determine where to start
  const startPhaseIndex = (() => {
    if (level === 'senior') return Math.max(1, personalizedPhases.findIndex(p => p.phaseStatus === 'todo'));
    if (level === 'mid') return Math.max(0, personalizedPhases.findIndex(p => p.phaseStatus !== 'known'));
    return 0;
  })();

  // Build quick wins (partial topics to complete first)
  const quickWins = personalizedPhases
    .flatMap(p => p.topics.filter(t => t.status === 'partial'))
    .slice(0, 3);

  // Compute total estimated weeks
  const todoWeeks = personalizedPhases
    .filter(p => p.phaseStatus !== 'known')
    .reduce((sum, p) => sum + p.estimatedWeeks, 0);

  // Build certification recommendation
  const certRecs = [];
  if (level === 'junior' || !knownTopicIds.includes('kubernetes')) certRecs.push('CKA (Certified Kubernetes Administrator)');
  if (!knownTopicIds.includes('aws')) certRecs.push('AWS Solutions Architect Associate');
  if (!knownTopicIds.includes('terraform')) certRecs.push('HashiCorp Terraform Associate');
  if (level === 'senior') certRecs.push('AWS DevOps Engineer Professional', 'CKS (Certified Kubernetes Security Specialist)');

  return {
    name,
    experienceLevel: level,
    yearsOfExperience: years,
    domain,
    learningStyle,
    education,
    knownTopicIds,
    knownPhaseIds,
    personalizedPhases,
    startPhaseIndex,
    quickWins,
    estimatedWeeksToComplete: todoWeeks,
    recommendedCertifications: certRecs.slice(0, 4),
    profileSummary: buildProfileSummary({ name, level, years, domain, knownTopicIds, education })
  };
}

function buildProfileSummary({ name, level, years, domain, knownTopicIds, education }) {
  const yStr = years ? `${years} years of ` : '';
  const known = knownTopicIds.length;
  return `${name ? name + ' is a ' : 'You are a '}${level}-level engineer with ${yStr}experience in ${domain}. `
    + `Your resume shows familiarity with ${known} topic${known !== 1 ? 's' : ''} in the Cloud & DevOps landscape. `
    + `${education ? `Education: ${education}. ` : ''}`
    + `The personalized roadmap below highlights what to learn next, in the optimal order for your background.`;
}
