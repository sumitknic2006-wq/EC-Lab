import { RouterProvider } from './routes/router';
import { useRouter } from './routes/useRouter';
import AppLayout from './components/layout/AppLayout';
import HeroSection from './components/common/HeroSection';
import HowItWorksPlaceholder from './components/common/HowItWorksPlaceholder';
import ProjectRepositorySection from './components/projects/ProjectRepositorySection';
import ProjectOverviewPage from './pages/ProjectOverviewPage';
import ProjectVerificationPage from './pages/ProjectVerificationPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * AppContent
 * Routes between the central repository landing page, dedicated
 * public project overview pages (/projects/:slug), physical tag verification
 * demonstration (/verify/demo-tag), and fallback 404.
 */
function AppContent() {
  const { currentPath } = useRouter();

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

  // Home / landing page
  if (currentPath === '/' || currentPath === '') {
    return (
      <>
        <HeroSection />
        <HowItWorksPlaceholder />
        <ProjectRepositorySection />
      </>
    );
  }

  // Unmatched route fallback
  return <NotFoundPage currentPath={currentPath} />;
}

/**
 * App
 * Top-level application with lightweight client-side routing and shared layout.
 */
export default function App() {
  return (
    <RouterProvider>
      <AppLayout>
        <AppContent />
      </AppLayout>
    </RouterProvider>
  );
}
