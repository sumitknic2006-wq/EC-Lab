import { RouterProvider } from './routes/router';
import { useRouter } from './routes/useRouter';
import { AuthProvider } from './context/AuthProvider';
import AppLayout from './components/layout/AppLayout';
import HeroSection from './components/common/HeroSection';
import TheWorkflowSection from './components/common/TheWorkflowSection';
import PlatformCapabilitiesSection from './components/common/PlatformCapabilitiesSection';
import PricingTiersSection from './components/common/PricingTiersSection';
import TestimonialsSection from './components/common/TestimonialsSection';
import ProjectRepositorySection from './components/projects/ProjectRepositorySection';
import ProjectOverviewPage from './pages/ProjectOverviewPage';
import ProjectVerificationPage from './pages/ProjectVerificationPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * AppContent
 * Routes between the central repository landing page, dedicated
 * public project overview pages (/projects/:slug), physical tag verification
 * demonstration (/verify/demo-tag), authentication screens (/login, /signup),
 * authenticated student portal (/profile), and fallback 404.
 */
function AppContent() {
  const { currentPath } = useRouter();

  // Authentication screens
  if (currentPath === '/login' || currentPath === '/login/') {
    return <LoginPage />;
  }

  if (currentPath === '/signup' || currentPath === '/signup/') {
    return <SignupPage />;
  }

  // Authenticated profile view
  if (currentPath === '/profile' || currentPath === '/profile/') {
    return <ProfilePage />;
  }

  // Match /verify or /verify/demo-tag or /verify/:tagId
  if (currentPath === '/verify' || currentPath.startsWith('/verify/')) {
    return <ProjectVerificationPage />;
  }

  // Match /projects/:slug
  const projectMatch = currentPath.match(/^\/projects\/([^/]+)\/?$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    return <ProjectOverviewPage slug={slug} />;
  }

  // Home / landing page matching Outreach.ai layout
  if (currentPath === '/' || currentPath === '') {
    return (
      <>
        <HeroSection />
        <TheWorkflowSection />
        <PlatformCapabilitiesSection />
        <PricingTiersSection />
        <TestimonialsSection />
        <ProjectRepositorySection />
      </>
    );
  }

  // Unmatched route fallback
  return <NotFoundPage currentPath={currentPath} />;
}

/**
 * App
 * Top-level application with lightweight client-side routing,
 * centralized session authentication, and shared layout.
 */
export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppLayout>
          <AppContent />
        </AppLayout>
      </AuthProvider>
    </RouterProvider>
  );
}
