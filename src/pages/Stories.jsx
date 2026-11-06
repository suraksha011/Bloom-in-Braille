import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Search,
  X,
  BookOpen,
} from 'lucide-react';

import { stories } from '../data/stories.js';
import { PageHero } from '../components/Layout.jsx';

const storySymbols = ['☾', '⌁', '✿'];

export default function Stories({
  bookmarks = [],
  toggleBookmark,
}) {
  const [query, setQuery] = useState('');

  // Filter stories based on title, description or tag.
  const filteredStories = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) return stories;

    return stories.filter((story) => {
      const searchableContent = [
        story.title,
        story.desc,
        story.tag,
        story.author,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableContent.includes(searchTerm);
    });
  }, [query]);

  const handleBookmark = (storyId) => {
    toggleBookmark?.(storyId);
  };

  return (
    <PageHero
      eyebrow="THE STORY GARDEN"
      title={
        <>
          A few stories to <em>begin with.</em>
        </>
      }
      intro="Read a little, save a favourite, or send a story into the book-making journey. Every story has a place here."
    >
      {/* Search and story count */}
      <div className="story-tools">
        <label className="searchbox">
          <Search size={18} aria-hidden="true" />

          <span className="sr-only">Search stories</span>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a story..."
            aria-label="Search stories by title, description, author or tag"
          />

          {query && (
            <button
              type="button"
              className="icon-button clear-search"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <span className="story-count" aria-live="polite">
          {filteredStories.length}{' '}
          {filteredStories.length === 1 ? 'little story' : 'little stories'}
        </span>
      </div>

      {/* Story collection */}
      {filteredStories.length > 0 ? (
        <div className="stories-grid">
          {filteredStories.map((story, index) => {
            const isBookmarked = bookmarks.includes(story.id);

            return (
              <article
                className={`story-card story-tone-${index % 3}`}
                key={story.id}
              >
                {/* Decorative story artwork */}
                <div className="story-card-art" aria-hidden="true">
                  <span className="story-art-symbol">
                    {storySymbols[index % storySymbols.length]}
                  </span>

                  <span className="story-art-label">
                    {story.tag || 'A LITTLE STORY'}
                  </span>
                </div>

                {/* Story information */}
                <div className="story-card-body">
                  <div className="story-card-meta">
                    <span>{story.author || 'Bloom in Braille'}</span>

                    <button
                      type="button"
                      className={`icon-button bookmark-button ${
                        isBookmarked ? 'is-bookmarked' : ''
                      }`}
                      onClick={() => handleBookmark(story.id)}
                      aria-label={
                        isBookmarked
                          ? `Remove ${story.title} from bookmarks`
                          : `Save ${story.title} to bookmarks`
                      }
                      aria-pressed={isBookmarked}
                      title={
                        isBookmarked
                          ? 'Remove bookmark'
                          : 'Save story'
                      }
                    >
                      {isBookmarked ? (
                        <BookmarkCheck size={19} />
                      ) : (
                        <Bookmark size={19} />
                      )}
                    </button>
                  </div>

                  <h3>{story.title}</h3>

                  <p>{story.desc}</p>

                  {/* Story actions */}
                  <div className="story-actions">
                    <Link
                      className="small-link"
                      to={`/stories/${story.id}`}
                    >
                      <BookOpen size={15} />
                      Read story
                    </Link>

                    <Link
                      className="small-link"
                      to={`/stories/${story.id}#prepare`}
                    >
                      Prepare
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state story-empty-state">
          <BookOpen size={27} strokeWidth={1.5} />

          <h3>No stories found.</h3>

          <p>
            We couldn't find anything matching "{query}".
            Try another little word.
          </p>

          <button
            type="button"
            className="btn pale"
            onClick={() => setQuery('')}
          >
            Clear search
          </button>
        </div>
      )}

      {/* Closing note */}
      {filteredStories.length > 0 && (
        <div className="story-garden-note">
          <span aria-hidden="true">✿</span>
          <p>Take a story with you. Let it bloom somewhere new.</p>
        </div>
      )}
    </PageHero>
  );
}