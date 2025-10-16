import { useState, useEffect, useCallback } from 'react';

interface UseRequirementsModalOptions {
  autoShow?: boolean;
  showOnce?: boolean;
  sessionOnly?: boolean;
  enableAIFeatures?: boolean;
  enableNeuralAnimation?: boolean;
  performanceMode?: 'standard' | 'optimized' | 'ultra';
  workflowType?: 'standard' | 'enterprise';
}

interface AIRequirements {
  modelType?: string;
  nlpTraining?: boolean;
  timeline?: string;
  integrationNeeds?: string[];
  chatbotFeatures?: string[];
  dataTraining?: boolean;
  voiceIntegration?: boolean;
  customRequirements?: string;
}

interface EnterpriseConsultationData {
  hasExistingWebsite?: boolean;
  websiteDetails?: string;
  preferredAIModel?: string;
  customAIModelRequest?: boolean;
  projectTimeline?: string;
  budgetRange?: string;
  targetPlatform?: string[];
  businessNiche?: string;
  securityRequirements?: string[];
  companySize?: string;
  expectedUserVolume?: string;
  integrationComplexity?: string;
  projectScope?: string[];
  deliverables?: string[];
  additionalRequirements?: string;
}

interface UseRequirementsModalReturn {
  isOpen: boolean;
  shouldShow: boolean;
  openModal: () => void;
  closeModal: () => void;
  markAsShown: () => void;
  resetShownStatus: () => void;
  aiRequirements: AIRequirements;
  updateAIRequirements: (requirements: Partial<AIRequirements>) => void;
  resetAIRequirements: () => void;
  enterpriseConsultation: EnterpriseConsultationData;
  updateEnterpriseConsultation: (data: Partial<EnterpriseConsultationData>) => void;
  resetEnterpriseConsultation: () => void;
  workflowType: 'standard' | 'enterprise';
  setWorkflowType: (type: 'standard' | 'enterprise') => void;
}

export const useRequirementsModal = (
  options: UseRequirementsModalOptions = {}
): UseRequirementsModalReturn => {
  const {
    autoShow = false,
    showOnce = true,
    sessionOnly = false,
    enableAIFeatures = true,
    enableNeuralAnimation = true,
    performanceMode = 'optimized',
    workflowType = 'standard'
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const [aiRequirements, setAIRequirements] = useState<AIRequirements>({});
  const [enterpriseConsultation, setEnterpriseConsultation] = useState<EnterpriseConsultationData>({});
  const [currentWorkflowType, setCurrentWorkflowType] = useState<'standard' | 'enterprise'>(workflowType);

  // Storage keys
  const MODAL_SHOWN_KEY = 'requirements-modal-shown';
  const MODAL_SESSION_KEY = 'requirements-modal-session';

  // Check if modal has been shown before
  const checkShownStatus = useCallback(() => {
    if (typeof window === 'undefined') return true;

    if (!showOnce) return true;

    const storageKey = sessionOnly ? MODAL_SESSION_KEY : MODAL_SHOWN_KEY;
    const storage = sessionOnly ? sessionStorage : localStorage;
    
    return storage.getItem(storageKey) !== 'true';
  }, [showOnce, sessionOnly, MODAL_SHOWN_KEY, MODAL_SESSION_KEY]);

  // Mark modal as shown
  const markAsShown = useCallback(() => {
    if (typeof window === 'undefined') return;

    const storageKey = sessionOnly ? MODAL_SESSION_KEY : MODAL_SHOWN_KEY;
    const storage = sessionOnly ? sessionStorage : localStorage;
    
    storage.setItem(storageKey, 'true');
    setShouldShow(false);
  }, [sessionOnly, MODAL_SHOWN_KEY, MODAL_SESSION_KEY]);

  // Reset shown status (for testing or admin purposes)
  const resetShownStatus = useCallback(() => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(MODAL_SHOWN_KEY);
    sessionStorage.removeItem(MODAL_SESSION_KEY);
    setShouldShow(true);
  }, [MODAL_SHOWN_KEY, MODAL_SESSION_KEY]);

  // Open modal
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (showOnce) {
      markAsShown();
    }
  }, [showOnce, markAsShown]);

  // AI Requirements management
  const updateAIRequirements = useCallback((requirements: Partial<AIRequirements>) => {
    setAIRequirements(prev => ({
      ...prev,
      ...requirements
    }));
  }, []);

  const resetAIRequirements = useCallback(() => {
    setAIRequirements({});
  }, []);

  // Enterprise Consultation management
  const updateEnterpriseConsultation = useCallback((data: Partial<EnterpriseConsultationData>) => {
    setEnterpriseConsultation(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  const resetEnterpriseConsultation = useCallback(() => {
    setEnterpriseConsultation({});
  }, []);

  // Workflow type management
  const setWorkflowType = useCallback((type: 'standard' | 'enterprise') => {
    setCurrentWorkflowType(type);
  }, []);

  // Initialize shown status on mount
  useEffect(() => {
    const canShow = checkShownStatus();
    setShouldShow(canShow);

    // Auto-show if enabled and should show
    if (autoShow && canShow) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [autoShow, checkShownStatus]);

  return {
    isOpen,
    shouldShow,
    openModal,
    closeModal,
    markAsShown,
    resetShownStatus,
    aiRequirements,
    updateAIRequirements,
    resetAIRequirements,
    enterpriseConsultation,
    updateEnterpriseConsultation,
    resetEnterpriseConsultation,
    workflowType: currentWorkflowType,
    setWorkflowType
  };
};

export default useRequirementsModal;

