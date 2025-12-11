import React, { useState, useEffect } from 'react';
import { AgentRole, Message, CouncilState, Session, AgentConfig } from './types';
import { generateAgentResponse } from './services/geminiService';
import { AgentSidebar } from './components/AgentSidebar';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { UserGuideModal } from './components/UserGuideModal';
import { GuideContent } from './components/GuideContent';
import { QuickStart } from './components/QuickStart';
import { TEMPLATES, getAgentsForTemplate } from './constants';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  // Load initial state from local storage if available
  const [state, setState] = useState<CouncilState>(() => {
    const savedSessions = localStorage.getItem('council_sessions');
    return {
        view: 'dashboard',
        currentSessionId: null,
        sessions: savedSessions ? JSON.parse(savedSessions) : [],
        status: 'idle',
        currentAgent: null
    };
  });
  
  const [showGuide, setShowGuide] = useState(false);

  // Persist sessions
  useEffect(() => {
    localStorage.setItem('council_sessions', JSON.stringify(state.sessions));
  }, [state.sessions]);

  // Derive current session and agents
  const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
  const messages = currentSession ? currentSession.messages : [];
  
  // Dynamic agents based on selected template
  const activeAgents = currentSession 
    ? getAgentsForTemplate(currentSession.templateId) 
    : getAgentsForTemplate('general');

  // Calculate consensus score (average of last messages)
  const consensusScore = React.useMemo(() => {
    if (!messages.length) return undefined;
    const recentMsgs = messages.filter(m => m.metadata?.confidence).slice(-3);
    if (recentMsgs.length === 0) return undefined;
    const total = recentMsgs.reduce((acc, curr) => acc + (curr.metadata?.confidence || 0), 0);
    return Math.round(total / recentMsgs.length);
  }, [messages]);

  const startNewSession = (templateId: string) => {
      const newSession: Session = {
          id: Date.now().toString(),
          title: 'New Council Session',
          templateId,
          lastModified: Date.now(),
          messages: [],
          status: 'active'
      };

      setState(prev => ({
          ...prev,
          sessions: [newSession, ...prev.sessions],
          currentSessionId: newSession.id,
          view: 'chat',
          status: 'idle',
          currentAgent: null
      }));
  };

  const startQuickSession = async (industry: string, role: string, goal: string) => {
      const newSession: Session = {
          id: Date.now().toString(),
          title: goal.length > 30 ? goal.slice(0, 30) + '...' : goal,
          templateId: 'general',
          lastModified: Date.now(),
          messages: [],
          status: 'active'
      };

      // Construct context-rich prompt
      const contextPrompt = `**Context:** Industry: ${industry}, Role: ${role}.\n\n**Objective:** ${goal}`;
      
      const userMsg: Message = {
        id: Date.now().toString(),
        role: AgentRole.USER,
        content: contextPrompt,
        timestamp: Date.now()
      };

      // Set state to chat view with new session
      setState(prev => ({
          ...prev,
          sessions: [
              { ...newSession, messages: [userMsg] },
              ...prev.sessions
          ],
          currentSessionId: newSession.id,
          view: 'chat',
          status: 'active',
          currentAgent: null
      }));

      // Trigger workflow immediately
      // We need to pass the session data explicitly because state update is async
      await runWorkflow([userMsg], newSession.id, 'general');
  };

  const openSession = (sessionId: string) => {
      setState(prev => ({
          ...prev,
          currentSessionId: sessionId,
          view: 'chat',
          status: prev.sessions.find(s => s.id === sessionId)?.status || 'idle'
      }));
  };

  const addMessageToSession = (sessionId: string, message: Message) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => {
          if (s.id === sessionId) {
              // Update title if it's the first user message
              const newTitle = (s.messages.length === 0 && message.role === AgentRole.USER) 
                  ? message.content.slice(0, 40) + (message.content.length > 40 ? '...' : '') 
                  : s.title;
              return {
                  ...s,
                  messages: [...s.messages, message],
                  lastModified: Date.now(),
                  title: newTitle
              };
          }
          return s;
      })
    }));
  };

  const updateLastMessageInSession = (sessionId: string, content: string, confidence: number) => {
      setState(prev => ({
          ...prev,
          sessions: prev.sessions.map(s => {
              if (s.id === sessionId) {
                  const newMessages = [...s.messages];
                  if (newMessages.length > 0) {
                      newMessages[newMessages.length - 1] = {
                          ...newMessages[newMessages.length - 1],
                          content,
                          isThinking: false,
                          metadata: { confidence }
                      };
                  }
                  return { ...s, messages: newMessages };
              }
              return s;
          })
      }));
  };

  const runAgentTurn = async (
      role: Exclude<AgentRole, AgentRole.USER>, 
      currentHistory: Message[], 
      sessionId: string,
      agentsConfig: Record<string, AgentConfig>
  ) => {
    setState(prev => ({ ...prev, currentAgent: role }));
    
    // Add thinking message
    const thinkingMsg: Message = {
      id: Date.now().toString() + role,
      role: role,
      content: '',
      timestamp: Date.now(),
      isThinking: true
    };
    
    addMessageToSession(sessionId, thinkingMsg);

    // Call API with the specific agent config for this template
    const response = await generateAgentResponse(agentsConfig[role], currentHistory, agentsConfig);
    
    // Update message
    updateLastMessageInSession(sessionId, response.text, response.confidence);

    return {
      ...thinkingMsg,
      content: response.text,
      isThinking: false,
      metadata: { confidence: response.confidence }
    };
  };

  const runWorkflow = async (initialHistory: Message[], sessionId: string, templateId: string) => {
      const agents = getAgentsForTemplate(templateId);
      let currentHistory = [...initialHistory];

      try {
          const plannerMsg = await runAgentTurn(AgentRole.PLANNER, currentHistory, sessionId, agents);
          currentHistory.push(plannerMsg);

          const executorMsg = await runAgentTurn(AgentRole.EXECUTOR, currentHistory, sessionId, agents);
          currentHistory.push(executorMsg);

          const criticMsg = await runAgentTurn(AgentRole.CRITIC, currentHistory, sessionId, agents);
          currentHistory.push(criticMsg);

          const managerMsg = await runAgentTurn(AgentRole.MANAGER, currentHistory, sessionId, agents);
          currentHistory.push(managerMsg);

          setState(prev => ({ ...prev, status: 'completed', currentAgent: null }));
      } catch (error) {
          console.error("Workflow error:", error);
          setState(prev => ({ ...prev, status: 'completed', currentAgent: null }));
      }
  };

  const handleUserSubmit = async (text: string) => {
    if (!state.currentSessionId) return;
    const sessionId = state.currentSessionId;
    const currentSession = state.sessions.find(s => s.id === sessionId);
    if (!currentSession) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: AgentRole.USER,
      content: text,
      timestamp: Date.now()
    };

    setState(prev => ({ ...prev, status: 'active' }));
    addMessageToSession(sessionId, userMsg);

    // Build context using current messages + new user message
    const currentHistory = [...currentSession.messages, userMsg];
    await runWorkflow(currentHistory, sessionId, currentSession.templateId);
  };

  // --- RENDER DASHBOARD ---
  if (state.view === 'dashboard') {
      return (
          <div className="min-h-screen bg-[#0f0f13] text-gray-100 p-6 xl:p-8">
              <UserGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
              
              <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                  
                  {/* LEFT COLUMN: Infographic Panel */}
                  <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 lg:p-8 shadow-2xl xl:sticky xl:top-8">
                      <header className="mb-8 flex items-center justify-between">
                          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 flex items-center gap-3">
                              <Icon name="Compass" className="text-purple-400" size={32} />
                              The AI Council: Boost Your Autonomy Ratio from 1:1 to 1:10+
                          </h1>
                      </header>
                      <GuideContent />
                  </div>

                  {/* RIGHT COLUMN: App Functions */}
                  <div className="flex flex-col gap-8">
                      
                      {/* Quick Start Section */}
                      <QuickStart onStart={startQuickSession} />

                      {/* Start Session Section */}
                      <section>
                          <div className="mb-4 flex items-center gap-4">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Or select a template</span>
                            <div className="h-px bg-white/10 flex-1"></div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {TEMPLATES.map(template => (
                                  <button 
                                    key={template.id}
                                    onClick={() => startNewSession(template.id)}
                                    className="flex flex-col items-start text-left p-5 rounded-xl bg-[#18181b] border border-white/5 hover:border-purple-500/50 hover:bg-[#1f1f23] transition-all duration-300 group shadow-lg"
                                  >
                                      <div className="p-3 rounded-lg bg-black/40 text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                                          <Icon name={template.icon} size={24} />
                                      </div>
                                      <h3 className="font-bold text-base text-gray-200 mb-1">{template.name}</h3>
                                      <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                                  </button>
                              ))}
                          </div>
                      </section>

                      {/* Recent History */}
                      <section>
                          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Icon name="History" size={16} /> Session History
                          </h2>
                          <div className="space-y-3">
                              {state.sessions.length === 0 ? (
                                  <div className="text-gray-600 italic p-4 border border-white/5 rounded-xl bg-white/5">
                                    No past sessions found. Start a new one above.
                                  </div>
                              ) : (
                                  state.sessions.map(session => (
                                      <button 
                                        key={session.id}
                                        onClick={() => openSession(session.id)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-[#18181b] hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                                      >
                                          <div className="flex items-center gap-4">
                                              <div className="p-2 rounded bg-black/40 text-gray-400 group-hover:text-purple-400 transition-colors">
                                                  <Icon name={TEMPLATES.find(t => t.id === session.templateId)?.icon || 'Sparkles'} size={18} />
                                              </div>
                                              <div className="text-left">
                                                  <div className="font-medium text-gray-200 group-hover:text-white">{session.title}</div>
                                                  <div className="text-xs text-gray-500">{new Date(session.lastModified).toLocaleDateString()} • {session.messages.length} messages</div>
                                              </div>
                                          </div>
                                          <Icon name="ChevronRight" className="text-gray-600 group-hover:translate-x-1 transition-transform" size={16} />
                                      </button>
                                  ))
                              )}
                          </div>
                      </section>
                  </div>
              </div>
          </div>
      );
  }

  // --- RENDER CHAT ---
  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f13] text-gray-100">
      <UserGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

      <div className="hidden md:flex">
         <AgentSidebar 
            currentAgent={state.currentAgent} 
            status={state.status} 
            agents={activeAgents}
            templateName={TEMPLATES.find(t => t.id === currentSession?.templateId)?.name || 'General'}
            consensusScore={consensusScore}
         />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-white/10 bg-[#0f0f13] flex justify-between items-center">
             <h1 className="text-lg font-bold">Expert Council</h1>
             <div className="flex items-center gap-2">
                 <button 
                  onClick={() => setShowGuide(true)}
                  className="p-2 text-gray-400 hover:text-white"
                 >
                    <Icon name="HelpCircle" size={20} />
                 </button>
                 <button onClick={() => setState(prev => ({ ...prev, view: 'dashboard' }))}>
                    <Icon name="Layout" size={20} />
                 </button>
             </div>
        </div>

        {/* Desktop Header / Controls */}
        <div className="absolute top-4 right-4 z-10 hidden md:flex items-center gap-2">
            <button 
                onClick={() => setShowGuide(true)}
                className="p-2 rounded-full bg-black/50 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/10"
                title="How it works"
            >
                <Icon name="HelpCircle" size={20} />
            </button>
            <button 
                onClick={() => setState(prev => ({ ...prev, view: 'dashboard' }))}
                className="p-2 rounded-full bg-black/50 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/10"
                title="Back to Dashboard"
            >
                <Icon name="Layout" size={20} />
            </button>
        </div>
        
        <ChatArea messages={messages} status={state.status} agents={activeAgents} />
        
        <InputArea 
          onSend={handleUserSubmit} 
          disabled={state.status === 'active'} 
        />
      </div>
    </div>
  );
};

export default App;