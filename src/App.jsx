import { useCallback, useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Link,
} from 'react-router-dom';

import { ArrowLeft, Home as HomeIcon } from 'lucide-react';

import { Header, Footer } from './components/Layout.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Stories from './pages/Stories.jsx';
import StoryDetail from './pages/StoryDetail.jsx';
import Content from './pages/Content.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import Contact from './pages/Contact.jsx';

const BOOKMARK_STORAGE_KEY = 'bloom-bookmarks';

/* =================================
   BOOKMARK STORAGE
================================= */

function readBookmarks() {
  try {
    const stored = localStorage.getItem(BOOKMARK_STORAGE_KEY);

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    // Keep only unique string IDs.
    return [...new Set(
      parsed.filter((item) => typeof item === 'string')
    )];
  } catch (error) {
    console.warn('Unable to read saved bookmarks:', error);
    return [];
  }
}

/* =================================
   NOT FOUND PAGE
================================= */

function NotFound() {
  return (
    <section className="page-wrap not-found-page">
      <div className="page-heading">
        <span className="tiny-label">A LITTLE DETOUR</span>

        <h1>
          This page has <em>wandered off.</em>
        </h1>

        <p>
          We couldn't find the page you were looking for.
          Perhaps it's time to explore another little corner
          of Bloom in Braille.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn primary">
            <HomeIcon size={17} />
            Back home
          </Link>

          <Link to="/stories" className="btn pale">
            <ArrowLeft size={17} />
            Explore stories
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =================================
   MAIN APPLICATION
================================= */

export default function App() {
  const [bookmarks, setBookmarks] = useState(readBookmarks);

  const location = useLocation();

  /* Save bookmarks whenever they change. */
  useEffect(() => {
    try {
      localStorage.setItem(
        BOOKMARK_STORAGE_KEY,
        JSON.stringify(bookmarks)
      );
    } catch (error) {
      console.warn('Unable to save bookmarks:', error);
    }
  }, [bookmarks]);

  /* Scroll to the top when navigating to another page. */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [location.pathname]);

  /* Bookmark management. */
  const toggleBookmark = useCallback((id) => {
    if (typeof id !== 'string' || !id.trim()) return;

    setBookmarks((previousBookmarks) => {
      if (previousBookmarks.includes(id)) {
        return previousBookmarks.filter(
          (bookmark) => bookmark !== id
        );
      }

      return [...previousBookmarks, id];
    });
  }, []);

  /* Shared props for pages using bookmarks. */
  const sharedProps = {
    bookmarks,
    toggleBookmark,
  };

  return (
    <div className="app-shell">

      {/* Accessibility: Skip navigation */}
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* Global header */}
      <Header bookmarkCount={bookmarks.length} />

      {/* Main page content */}
      <main
        id="main-content"
        tabIndex="-1"
      >
        <Routes>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* About */}
          <Route
            path="/about"
            element={<About />}
          />

          {/* Stories */}
          <Route
            path="/stories"
            element={<Stories {...sharedProps} />}
          />

          <Route
            path="/stories/:storyId"
            element={<StoryDetail {...sharedProps} />}
          />

          {/* Learning and creation guides */}
          <Route
            path="/content/:section"
            element={<Content {...sharedProps} />}
          />

          {/* Bookmarks */}
          <Route
            path="/bookmarks"
            element={<Bookmarks {...sharedProps} />}
          />

          {/* Contact */}
          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* Invalid routes */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>

      {/* Global footer */}
      <Footer />

    </div>
  );
}