import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ScreenType, ServiceItem, DocumentItem, DocumentStatus } from './types';
import { FULL_SERVICES_CATALOG } from './data/localizedServices';
import { INITIAL_NOTIFICATIONS } from './data/mockData';
import { loadServiceDocuments, saveServiceDocuments } from './utils/serviceDocuments';
import { BottomNavBar } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';

import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchServicesScreen } from './screens/SearchServicesScreen';
import { ServiceDetailsScreen } from './screens/ServiceDetailsScreen';
import { QuestionnaireScreen } from './screens/QuestionnaireScreen';
import { PreparationPlanScreen } from './screens/PreparationPlanScreen';
import { DocumentChecklistScreen } from './screens/DocumentChecklistScreen';
import { DocumentGuideScreen } from './screens/DocumentGuideScreen';
import { ReadinessDashboardScreen } from './screens/ReadinessDashboardScreen';
import { CompletionScreen } from './screens/CompletionScreen';
import { NearbyOfficesScreen } from './screens/NearbyOfficesScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { HelpSupportScreen } from './screens/HelpSupportScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [history, setHistory] = useState<ScreenType[]>([]);
  const [services] = useState<ServiceItem[]>(FULL_SERVICES_CATALOG);
  const [selectedService, setSelectedService] = useState<ServiceItem>(FULL_SERVICES_CATALOG[0]);
  
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    return loadServiceDocuments(FULL_SERVICES_CATALOG[0]);
  });

  const [notifications] = useState(INITIAL_NOTIFICATIONS);

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    const serviceDocs = loadServiceDocuments(service);
    setDocuments(serviceDocs);
  };

  // Synchronize browser history and handle browser back button
  useEffect(() => {
    if (!window.history.state?.screen) {
      window.history.replaceState({ screen: currentScreen }, '', `#${currentScreen}`);
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setCurrentScreen(event.state.screen);
        setHistory((prev) => {
          if (prev.length > 0) {
            const next = [...prev];
            next.pop();
            return next;
          }
          return [];
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (screen: ScreenType) => {
    if (screen === currentScreen) return;

    if (screen === 'home' || screen === 'splash' || screen === 'onboarding' || screen === 'login') {
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
    try {
      window.history.pushState({ screen }, '', `#${screen}`);
    } catch (e) {
      // Fallback if browser pushState is restricted
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setHistory((prev) => {
      if (prev.length === 0) {
        setCurrentScreen('home');
        try {
          window.history.pushState({ screen: 'home' }, '', '#home');
        } catch (e) {}
        return [];
      }
      const newHistory = [...prev];
      const lastScreen = newHistory.pop() || 'home';
      setCurrentScreen(lastScreen);
      try {
        window.history.pushState({ screen: lastScreen }, '', `#${lastScreen}`);
      } catch (e) {}
      return newHistory;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateDocumentStatus = (id: string, status: DocumentStatus) => {
    setDocuments((prev) => {
      const updated = prev.map((doc) => (doc.id === id ? { ...doc, status } : doc));
      saveServiceDocuments(selectedService.id, updated);
      return updated;
    });
  };

  const handleMarkAsObtained = () => {
    // Marks missing / address document as 'have'
    setDocuments((prev) => {
      const updated = prev.map((doc) =>
        doc.id === 'doc-address' || doc.status !== 'have'
          ? { ...doc, status: 'have' as DocumentStatus }
          : doc
      );
      saveServiceDocuments(selectedService.id, updated);
      return updated;
    });
  };

  const showBottomNav = [
    'home',
    'search',
    'document_checklist',
    'readiness_dashboard',
    'profile'
  ].includes(currentScreen);

  const knownScreens: ScreenType[] = [
    'splash', 'onboarding', 'login', 'home', 'search', 'service_details',
    'questionnaire', 'preparation_plan', 'document_checklist', 'document_guide',
    'readiness_dashboard', 'completion', 'nearby_offices', 'notifications',
    'profile', 'settings', 'help_support'
  ];

  const isUnknownScreen = !knownScreens.includes(currentScreen);

  return (
    <ErrorBoundary onReset={() => navigateTo('home')}>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen bg-[#f8f9ff] text-[#121c28] font-sans selection:bg-[#005db6] selection:text-white flex flex-col">
            <OfflineBanner />

            <div className="flex-1 flex flex-col">
              {currentScreen === 'splash' && (
                <SplashScreen onStart={() => navigateTo('onboarding')} />
              )}

              {currentScreen === 'onboarding' && (
                <OnboardingScreen onComplete={() => navigateTo('login')} />
              )}

              {currentScreen === 'login' && (
                <LoginScreen onLogin={() => navigateTo('home')} />
              )}

              {currentScreen === 'home' && (
                <HomeScreen
                  services={services}
                  selectedService={selectedService}
                  documents={documents}
                  onNavigate={navigateTo}
                  onSelectService={(service) => {
                    handleSelectService(service);
                    navigateTo('service_details');
                  }}
                />
              )}

              {currentScreen === 'search' && (
                <SearchServicesScreen
                  services={services}
                  onBack={handleBack}
                  onSelectService={(service) => {
                    handleSelectService(service);
                    navigateTo('service_details');
                  }}
                />
              )}

              {currentScreen === 'service_details' && (
                <ServiceDetailsScreen
                  service={selectedService}
                  onBack={handleBack}
                  onStartPreparation={() => navigateTo('document_checklist')}
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'questionnaire' && (
                <QuestionnaireScreen
                  onBack={handleBack}
                  onNext={() => navigateTo('document_checklist')}
                />
              )}

              {currentScreen === 'preparation_plan' && (
                <PreparationPlanScreen
                  selectedService={selectedService}
                  documents={documents}
                  onBack={handleBack}
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'document_checklist' && (
                <DocumentChecklistScreen
                  documents={documents}
                  selectedService={selectedService}
                  onUpdateStatus={handleUpdateDocumentStatus}
                  onBack={handleBack}
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'document_guide' && (
                <DocumentGuideScreen
                  onBack={handleBack}
                  onMarkAsObtained={handleMarkAsObtained}
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'readiness_dashboard' && (
                <ReadinessDashboardScreen
                  documents={documents}
                  selectedService={selectedService}
                  onBack={handleBack}
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'completion' && (
                <CompletionScreen onBack={handleBack} onNavigate={navigateTo} />
              )}

              {currentScreen === 'nearby_offices' && (
                <NearbyOfficesScreen
                  selectedService={selectedService}
                  onBack={handleBack}
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'notifications' && (
                <NotificationsScreen
                  notifications={notifications}
                  onBack={handleBack}
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'profile' && (
                <ProfileScreen
                  onNavigate={navigateTo}
                  onLogout={() => navigateTo('login')}
                />
              )}

              {currentScreen === 'settings' && (
                <SettingsScreen onBack={handleBack} />
              )}

              {currentScreen === 'help_support' && (
                <HelpSupportScreen onBack={handleBack} />
              )}

              {isUnknownScreen && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#eef4ff] text-[#005db6] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-2xl">search_off</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#001e40]">Page not found</h2>
                  <p className="text-xs text-[#43474f] mt-1 mb-4">
                    The requested page does not exist or was moved.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateTo('home')}
                    className="h-10 px-5 bg-[#005db6] hover:bg-[#00376f] text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Go to Home
                  </button>
                </div>
              )}
            </div>

            {showBottomNav && (
              <BottomNavBar
                currentScreen={currentScreen}
                onNavigate={navigateTo}
                unreadNotificationsCount={notifications.filter((n) => n.unread).length}
              />
            )}
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

