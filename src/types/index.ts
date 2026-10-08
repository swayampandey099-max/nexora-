export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: 'web' | 'ai' | 'automation' | 'whatsapp' | 'enterprise' | 'design';
  tagline: string;
  description: string;
  deliverables: string[];
  metrics: string;
  image: string;
  featured?: boolean;
}

export interface BookingData {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  serviceId: string;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  projectBrief: string;
  createdAt: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface SecurityAuditResult {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'warning' | 'verified';
  details: string;
  score: number;
}
