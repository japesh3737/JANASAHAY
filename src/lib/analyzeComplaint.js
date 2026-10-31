import { db } from '@/api/base44Client';

import { CATEGORIES, PRIORITIES } from '@/lib/grievanceMeta';

export async function analyzeComplaint({ description, categoryKey, lang }) {
  const chosen = CATEGORIES.find((category) => category.key === categoryKey);
  const languageName = lang === 'te' ? 'Telugu' : 'English';
  const categoryList = CATEGORIES.map((category) => `- ${category.label} → ${category.department}`).join(
    '\n'
  );

  const prompt = `You help a citizen in India prepare a clear, respectful civic grievance from their own description.

Citizen's description:
"""
${description}
"""

${
  chosen
    ? `The citizen already selected the service area "${chosen.label}". Keep it unless the description clearly belongs to a different service area.`
    : 'The citizen did not choose a service area; choose the closest one.'
}

Service areas and the authority that handles each:
${categoryList}

Write every text field in ${languageName}.

Rules:
- Never invent names, dates, addresses, numbers or facts that are not present in the description.
- The summary is factual and neutral, 2 to 3 sentences, in the citizen's own language.
- The title is one clear line of at most 90 characters, without quotation marks.
- Priority reflects risk: Critical for danger to life or health affecting many people; High for a health or safety risk or a long delay; Medium for a service disruption; Low for minor inconvenience.
- Reasoning explains in one or two sentences why this category, department and priority fit.`;

  return db.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        category: { type: 'string', enum: CATEGORIES.map((category) => category.label) },
        department: { type: 'string' },
        summary: { type: 'string' },
        priority: { type: 'string', enum: PRIORITIES },
        reasoning: { type: 'string' },
      },
      required: ['title', 'category', 'department', 'summary', 'priority', 'reasoning'],
    },
  });
}