import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, BookOpen, Compass } from 'lucide-react';

import { stories } from '../data/stories.js';
import { guideLinks } from '../data/guides.js';
import { PageHero } from '../components/Layout.jsx';

export default function Bookmarks({ bookmarks = [], toggleBookmark }) {
  // Separate saved stories and guide sections.
  const savedStories = stories.filter((story) =>
    bookmarks.includes(story.id)
  );

  const savedGuides = bookmarks
    .filter((item) => item.startsWith('guide:'))
    .map((key) => {
      const slug = key.replace('guide:', '');
      const guide = guideLinks.find((item) => item[2] === slug);

      return {
        key,
        slug,
        title: guide?.[0] || slug,
      };
    });

  const hasBookmarks = savedStories.length > 0 || savedGuides.length > 0;

  return (
    <PageHero
      eyebrow="SAVED FOR LATER"
      title={
        <>
          Your little trail of <em>bookmarks.</em>
        </>
      }
      intro="A collection of stories and little things you've saved along the way. Everything stays in this browser, without needing an account."
    >
      {/* Storage information */}
      <div className="notice-box">
        <Bookmark size={25} strokeWidth={1.6} />

        <div>
          <b>Saved on this device</b>
          <p>
            Your bookmarks are stored in this browser. Clearing browser
            data or switching devices may cause you to lose them.
            There is no account-based synchronisation.
          </p>
        </div>
      </div>

      {/* Saved stories */}
      <section className="bookmark-section" aria-labelledby="saved-stories">
        <div className="saved-section-heading">
          <div>
            <span className="card-kicker">YOUR STORY COLLECTION</span>
            <h2 className="saved-heading" id="saved-stories">
              Stories
            </h2>
          </div>

          <span className="bookmark-count">
            {savedStories.length} saved
          </span>
        </div>

        {savedStories.length > 0 ? (
          <div className="stories-grid">
            {savedStories.map((story) => (
              <article className="paper-card bookmark-card" key={story.id}>
                <div className="bookmark-card-icon">
                  <BookOpen size={21} strokeWidth={1.5} />
                </div>

                <h3>{story.title}</h3>

                <p>{story.desc}</p>

                <div className="bookmark-card-actions">
                  <Link
                    className="small-link"
                    to={`/stories/${story.id}`}
                    aria-label={`Read ${story.title}`}
                  >
                    Read story <ArrowRight size={15} />
                  </Link>

                  <button
                    type="button"
                    className="remove-link"
                    onClick={() => toggleBookmark?.(story.id)}
                    aria-label={`Remove ${story.title} from bookmarks`}
                  >
                    Remove bookmark
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <BookOpen size={25} strokeWidth={1.5} />
            <h3>No stories saved just yet.</h3>
            <p>
              When a story catches your heart, bookmark it and
              you'll find it waiting here.
            </p>
            <Link to="/stories" className="small-link">
              Explore stories <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>

      {/* Saved guide sections */}
      <section className="bookmark-section" aria-labelledby="saved-guides">
        <div className="saved-section-heading">
          <div>
            <span className="card-kicker">LITTLE THINGS TO LEARN</span>
            <h2 className="saved-heading" id="saved-guides">
              Guide sections
            </h2>
          </div>

          <span className="bookmark-count">
            {savedGuides.length} saved
          </span>
        </div>

        {savedGuides.length > 0 ? (
          <div className="saved-links">
            {savedGuides.map((guide) => (
              <Link
                className="side-link saved-guide-link"
                key={guide.key}
                to={`/content/${guide.slug}`}
              >
                <span>{guide.title}</span>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Compass size={25} strokeWidth={1.5} />
            <h3>No guide sections saved yet.</h3>
            <p>
              Explore the learning corner and save the sections
              you'd like to revisit.
            </p>
            <Link to="/content" className="small-link">
              Explore guides <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>

      {/* Overall empty state */}
      {!hasBookmarks && (
        <p className="bookmark-footer-note">
          Your bookmark garden is waiting for its first little addition. 🌷
        </p>
      )}
    </PageHero>
  );
}