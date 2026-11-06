import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Clock,
  Download,
  BookOpen,
} from 'lucide-react';

import { stories } from '../data/stories.js';
import { PageHero } from '../components/Layout.jsx';

const PENDING_STORY_KEY = 'bloom-pending-story';

export default function StoryDetail({
  bookmarks = [],
  toggleBookmark,
}) {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const story = stories.find((item) => item.id === storyId);

  const isBookmarked = story
    ? bookmarks.includes(story.id)
    : false;

  // Prepare story text in one consistent format.
  const storyText = story?.body?.join('\n\n') || '';

  // Handle direct navigation to the preparation section.
  useEffect(() => {
    if (!story || window.location.hash !== '#prepare') return;

    try {
      sessionStorage.setItem(
        PENDING_STORY_KEY,
        JSON.stringify({
          id: story.id,
          title: story.title,
          text: storyText,
        })
      );
    } catch (error) {
      console.error('Unable to save the selected story:', error);
    }
  }, [story, storyText]);

  // Handle missing stories.
  if (!story) {
    return (
      <PageHero
        eyebrow="STORY NOT FOUND"
        title={
          <>
            This page has <em>wandered off.</em>
          </>
        }
        intro="The story may have moved, or the link might be incorrect. Visit the story garden to find another little adventure."
      >
        <div className="story-not-found">
          <BookOpen size={34} strokeWidth={1.4} />

          <Link className="btn primary" to="/stories">
            Back to the story garden
            <ArrowRight size={17} />
          </Link>
        </div>
      </PageHero>
    );
  }

  // Toggle bookmark state.
  const handleBookmark = () => {
    toggleBookmark?.(story.id);
  };

  // Transfer story to Upload & Get.
  const handlePrepare = () => {
    try {
      sessionStorage.setItem(
        PENDING_STORY_KEY,
        JSON.stringify({
          id: story.id,
          title: story.title,
          text: storyText,
        })
      );

      navigate('/content/upload');
    } catch (error) {
      console.error('Unable to transfer the selected story:', error);
      alert(
        'We could not prepare this story. Please try again.'
      );
    }
  };

  // Download the original story as a text file.
  const handleDownload = () => {
    const content = `${story.title}\n\n${storyText}`;

    const blob = new Blob(
      [content],
      { type: 'text/plain;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${story.id}.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    // Release the generated object URL after the download starts.
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <PageHero
      eyebrow={`STORY GARDEN / ${(story.tag || 'STORY').toUpperCase()}`}
      title={<>{story.title}</>}
      intro={story.desc}
    >
      <article className="story-reading paper-card">

        {/* Story information */}
        <div className="story-meta-line">
          <span>
            <Clock size={16} aria-hidden="true" />
            {story.readTime || 'A little read'}
          </span>

          <span>{story.author || 'Bloom in Braille'}</span>
        </div>

        {/* Story content */}
        <div className="story-reading-content">
          {story.body?.map((paragraph, index) => (
            <p className="story-text" key={`${story.id}-${index}`}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Story actions */}
        <div className="story-detail-actions">

          <button
            type="button"
            className="btn pale"
            onClick={handleBookmark}
            aria-pressed={isBookmarked}
            aria-label={
              isBookmarked
                ? `Remove ${story.title} from bookmarks`
                : `Bookmark ${story.title}`
            }
          >
            {isBookmarked ? (
              <BookmarkCheck size={17} />
            ) : (
              <Bookmark size={17} />
            )}

            {isBookmarked ? 'Saved' : 'Bookmark story'}
          </button>

          <button
            type="button"
            className="btn pale"
            onClick={handleDownload}
          >
            <Download size={17} />
            Download story
          </button>

          <button
            type="button"
            id="prepare"
            className="btn primary"
            onClick={handlePrepare}
          >
            Prepare this story
            <ArrowRight size={17} />
          </button>
        </div>
      </article>

      {/* Back navigation */}
      <Link className="back-link" to="/stories">
        <ArrowLeft size={16} />
        Back to all stories
      </Link>
    </PageHero>
  );
}