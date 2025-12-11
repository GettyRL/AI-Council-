import { AgentConfig, AgentRole, CouncilTemplate } from './types';

// Base definitions
export const BASE_AGENTS: Record<Exclude<AgentRole, AgentRole.USER>, AgentConfig> = {
  [AgentRole.PLANNER]: {
    id: AgentRole.PLANNER,
    name: 'The Planner',
    title: 'Strategic Architect',
    description: 'Breaks down the goal into executable steps.',
    color: 'text-blue-400',
    iconName: 'Compass',
    systemInstruction: `You are The Planner. Analyze the request and create a detailed plan. Focus on structure and strategy.`
  },
  [AgentRole.EXECUTOR]: {
    id: AgentRole.EXECUTOR,
    name: 'The Executor',
    title: 'Implementation Specialist',
    description: 'Performs the work based on the plan.',
    color: 'text-emerald-400',
    iconName: 'Zap',
    systemInstruction: `You are The Executor. Implement the solution based STRICTLY on the Planner's strategy.`
  },
  [AgentRole.CRITIC]: {
    id: AgentRole.CRITIC,
    name: 'The Critic',
    title: 'Quality Analyst',
    description: 'Reviews work for errors and flaws.',
    color: 'text-amber-400',
    iconName: 'ScanEye',
    systemInstruction: `You are The Critic. Review the Executor's output for bugs, flaws, or missing requirements.`
  },
  [AgentRole.MANAGER]: {
    id: AgentRole.MANAGER,
    name: 'The Manager',
    title: 'Integration Director',
    description: 'Synthesizes the final response.',
    color: 'text-purple-400',
    iconName: 'Crown',
    systemInstruction: `You are The Manager. Synthesize a FINAL response incorporating all feedback.`
  }
};

export const TEMPLATES: CouncilTemplate[] = [
  {
    id: 'general',
    name: 'General Council',
    description: 'Standard strategic problem solving and execution.',
    icon: 'Sparkles',
    roles: {} // Uses defaults
  },
  {
    id: 'marketing',
    name: 'Marketing Launch',
    description: 'SEO, Content Strategy, and Market Analysis.',
    icon: 'Megaphone',
    roles: {
      [AgentRole.PLANNER]: {
        name: 'Head of Strategy',
        title: 'Campaign Architect',
        systemInstruction: 'You are the Head of Strategy. Plan a comprehensive marketing campaign focusing on channels, KPIs, and target demographics.'
      },
      [AgentRole.EXECUTOR]: {
        name: 'Creative Lead',
        title: 'Content Creator',
        systemInstruction: 'You are the Creative Lead. Draft the actual ad copy, social posts, and content outlines defined by the strategy.'
      },
      [AgentRole.CRITIC]: {
        name: 'Data Analyst',
        title: 'ROI Optimizer',
        systemInstruction: 'You are the Data Analyst. Critique the creative work based on SEO best practices, potential ROI, and market fit.'
      },
      [AgentRole.MANAGER]: {
        name: 'CMO',
        title: 'Marketing Director',
        systemInstruction: 'You are the CMO. Package the campaign into a launch-ready executive summary.'
      }
    }
  },
  {
    id: 'product',
    name: 'Product Development',
    description: 'Feasibility, Tech Specs, and Go-to-Market.',
    icon: 'Box',
    roles: {
      [AgentRole.PLANNER]: {
        name: 'Product Manager',
        title: 'Product Visionary',
        systemInstruction: 'You are the Product Manager. Define the user stories, requirements, and roadmap.'
      },
      [AgentRole.EXECUTOR]: {
        name: 'Lead Engineer',
        title: 'Technical Architect',
        systemInstruction: 'You are the Lead Engineer. Write the technical specifications, pseudo-code, and architecture diagrams.'
      },
      [AgentRole.CRITIC]: {
        name: 'Security & QA',
        title: 'Risk Assessor',
        systemInstruction: 'You are Security & QA. Identify edge cases, security vulnerabilities, and scalability bottlenecks.'
      },
      [AgentRole.MANAGER]: {
        name: 'VP of Product',
        title: 'Launch Owner',
        systemInstruction: 'You are the VP of Product. Summarize the product plan and technical approach for stakeholders.'
      }
    }
  },
  {
    id: 'career',
    name: 'Career Coach',
    description: 'Skills analysis, market trends, and negotiation.',
    icon: 'Briefcase',
    roles: {
      [AgentRole.PLANNER]: {
        name: 'Career Strategist',
        title: 'Pathfinder',
        systemInstruction: 'You are a Career Strategist. Analyze the user\'s profile and goals to map out career advancement steps.'
      },
      [AgentRole.EXECUTOR]: {
        name: 'Resume Specialist',
        title: 'Personal Branding',
        systemInstruction: 'You are a Resume Specialist. Draft resume bullets, cover letters, or LinkedIn bios based on the strategy.'
      },
      [AgentRole.CRITIC]: {
        name: 'Recruiter',
        title: 'Market Reality Check',
        systemInstruction: 'You are a Corporate Recruiter. Critique the materials for red flags, ATS optimization, and market realism.'
      },
      [AgentRole.MANAGER]: {
        name: 'Talent Agent',
        title: 'Negotiation Coach',
        systemInstruction: 'You are a Talent Agent. Provide the final career action plan and salary negotiation scripts.'
      }
    }
  }
];

export const getAgentsForTemplate = (templateId: string) => {
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const agents = { ...BASE_AGENTS };
  
  // Merge template overrides
  (Object.keys(template.roles) as Array<Exclude<AgentRole, AgentRole.USER>>).forEach(role => {
    const override = template.roles[role];
    if (override) {
      agents[role] = {
        ...agents[role],
        ...override,
        // Ensure system instruction appends standard formatting rules if needed, 
        // but for now we just replace it to keep the persona strong.
      };
    }
  });
  
  return agents;
};