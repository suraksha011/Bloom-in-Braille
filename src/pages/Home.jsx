import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Heart,
  Sprout,
  Sparkles,
} from 'lucide-react';

const journeySteps = [
  {
    number: '01',
    title: 'Discover',
    description: 'Meet Braille and understand why it matters.',
    path: '/content/facts',
    Icon: Sprout,
  },
  {
    number: '02',
    title: 'Create',
    description: 'Choose a story and prepare its Braille version.',
    path: '/content/upload',
    Icon: Sparkles,
  },
  {
    number: '03',
    title: 'Make',
    description: 'Use a slate and stylus or an embosser.',
    path: '/content/diy',
    Icon: BookOpen,
  },
  {
    number: '04',
    title: 'Share',
    description: 'Check your book, then find a school to donate to.',
    path: '/content/next',
    Icon: Heart,
  },
];

function SectionLabel({ children }) {
  return <span className="tiny-label">{children}</span>;
}

export default function Home() {
  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero botanical-frame">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            STORIES THAT BLOOM FOR EVERYONE
          </div>

          <h1>
            A story is meant to be <em>felt,</em>
            <br />
            not just read.
          </h1>

          <p className="hero-sub">
            A little place to discover Braille, turn stories into
            touchable words, and help more people experience the
            joy of reading.
          </p>

          <div className="hero-buttons">
            <Link className="btn primary" to="/content/upload">
              Create a Braille story
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <Link className="btn text-btn" to="/about">
              Get to know us
            </Link>
          </div>

          <div className="hero-note">
            <span className="dot-cluster" aria-hidden="true">
              ⠿
            </span>
            No experience needed. Just a story to share.
          </div>
        </div>

        {/* Decorative Book Illustration */}
        <div
          className="hero-art"
          aria-hidden="true"
        >
          <div className="sun-disc" />

          <div className="book-illustration">
            <div className="book-page left-page">
              <span>
                Once upon
                <br />
                a time...
              </span>
              <i>✿</i>
            </div>

            <div className="book-page right-page">
              <div className="braille-dots">
                ⠠⠃⠇⠕⠕⠍
                <br />
                ⠊⠝ ⠃⠗⠁⠊⠇⠇⠑
              </div>
            </div>
          </div>

          <span className="hero-flower one">✿</span>
          <span className="hero-flower two">✿</span>

          <div className="art-caption">
            little stories
            <br />
            can make a big difference
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="intro-strip">
        <div>
          <SectionLabel>THE IDEA IS SIMPLE</SectionLabel>

          <h2>
            Make room for <em>every reader.</em>
          </h2>
        </div>

        <p>
          Learn a little. Make a book. Share a story.
          Bloom in Braille guides you through each step,
          from your first Braille cell to a finished book
          you can donate.
        </p>
      </section>

      {/* Journey Section */}
      <section className="section-pad">
        <div className="section-heading">
          <div>
            <SectionLabel>YOUR JOURNEY</SectionLabel>

            <h2>
              From curiosity to <em>connection.</em>
            </h2>
          </div>

          <p>Small steps, meaningful stories.</p>
        </div>

        <div className="journey-grid">
          {journeySteps.map(({ number, title, description, path, Icon }) => (
            <Link
              className="journey-card"
              key={number}
              to={path}
              aria-label={`${number}: ${title} — ${description}`}
            >
              <span className="step-no">{number}</span>

              <span className="journey-icon">
                <Icon size={23} strokeWidth={1.6} aria-hidden="true" />
              </span>

              <h3>{title}</h3>

              <p>{description}</p>

              <span className="card-arrow" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Stories */}
      <section className="story-feature">
        <div
          className="story-feature-art"
          aria-hidden="true"
        >
          <div className="story-sun" />

          <div className="mini-book">
            <span>✿</span>
            <b>
              Stories
              <br />
              to feel
            </b>
          </div>
        </div>

        <div className="story-feature-copy">
          <SectionLabel>A STORY TO START WITH</SectionLabel>

          <h2>
            Every little story
            <br />
            deserves a <em>way in.</em>
          </h2>

          <p>
            Explore gentle, original stories you can read,
            download, bookmark and prepare for a Braille book.
          </p>

          <Link className="btn dark" to="/stories">
            Explore the stories
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Closing Call to Action */}
      <section className="bottom-cta">
        <span className="cta-flower" aria-hidden="true">
          ✿
        </span>

        <SectionLabel>READY WHEN YOU ARE</SectionLabel>

        <h2>
          Let's help a story <em>find its way.</em>
        </h2>

        <p>
          You don't need to know Braille to begin.
          We'll help you take the first step.
        </p>

        <Link className="btn primary" to="/content/facts">
          Start exploring
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>

    </main>
  );
}