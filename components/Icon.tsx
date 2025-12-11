import React from 'react';
import { 
  Compass, Zap, ScanEye, Crown, Send, Loader2, Sparkles, 
  Megaphone, Box, Briefcase, Plus, Layout, History, 
  ChevronRight, CheckCircle2, AlertTriangle, ExternalLink,
  FileText, Trello, Github, Info, X, HelpCircle, Linkedin,
  Rocket, Building2, User
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  switch (name) {
    case 'Compass': return <Compass className={className} size={size} />;
    case 'Zap': return <Zap className={className} size={size} />;
    case 'ScanEye': return <ScanEye className={className} size={size} />;
    case 'Crown': return <Crown className={className} size={size} />;
    case 'Send': return <Send className={className} size={size} />;
    case 'Loader2': return <Loader2 className={className} size={size} />;
    case 'Sparkles': return <Sparkles className={className} size={size} />;
    case 'Megaphone': return <Megaphone className={className} size={size} />;
    case 'Box': return <Box className={className} size={size} />;
    case 'Briefcase': return <Briefcase className={className} size={size} />;
    case 'Plus': return <Plus className={className} size={size} />;
    case 'Layout': return <Layout className={className} size={size} />;
    case 'History': return <History className={className} size={size} />;
    case 'ChevronRight': return <ChevronRight className={className} size={size} />;
    case 'CheckCircle2': return <CheckCircle2 className={className} size={size} />;
    case 'AlertTriangle': return <AlertTriangle className={className} size={size} />;
    case 'ExternalLink': return <ExternalLink className={className} size={size} />;
    case 'FileText': return <FileText className={className} size={size} />;
    case 'Trello': return <Trello className={className} size={size} />;
    case 'Github': return <Github className={className} size={size} />;
    case 'Info': return <Info className={className} size={size} />;
    case 'X': return <X className={className} size={size} />;
    case 'HelpCircle': return <HelpCircle className={className} size={size} />;
    case 'Linkedin': return <Linkedin className={className} size={size} />;
    case 'Rocket': return <Rocket className={className} size={size} />;
    case 'Building2': return <Building2 className={className} size={size} />;
    case 'User': return <User className={className} size={size} />;
    default: return <Sparkles className={className} size={size} />;
  }
};