import { PageHero } from '../components/Layout.jsx';
import { Accessibility, Heart, Flower2, BookOpen } from 'lucide-react';

export default function About() {
return (
<PageHero
eyebrow="OUR LITTLE CORNER OF THE WORLD"
title={
<>
Stories should bloom <em>for everyone.</em>
</>
}
intro="We believe every story deserves to be discovered, experienced and remembered. Bloom in Braille is a little initiative with a big belief: making stories accessible should be something we can all be part of."
> <section className="about-intro"> <div className="about-intro-icon"> <Flower2 size={28} strokeWidth={1.4} /> </div>


    <p>
      Imagine creating a book that someone can read with their
      fingertips. That's the thought behind Bloom in Braille.
      We're here to help curious minds learn about Braille,
      turn stories into accessible formats and discover how
      a simple act of creation can make reading more inclusive.
    </p>
  </section>

  <div className="about-grid">
    <article className="paper-card">
      <span className="card-kicker">01 — OUR MISSION</span>
      <div className="about-card-icon">
        <BookOpen size={23} />
      </div>
      <h2>Make the first step feel possible.</h2>
      <p>
        Braille book creation can seem unfamiliar when you
        don't know where to begin. We bring together simple
        learning resources, practical DIY instructions and
        helpful tools to make the process easier to understand.
      </p>
    </article>

    <article className="paper-card pink-card">
      <span className="card-kicker">02 — OUR BELIEF</span>
      <div className="about-card-icon">
        <Heart size={23} />
      </div>
      <h2>Every story deserves to be felt.</h2>
      <p>
        Books open doors to imagination, knowledge and
        independence. We believe access to stories should
        never depend on how someone reads them.
      </p>
    </article>

    <article className="paper-card yellow-card">
      <span className="card-kicker">03 — HOW WE START</span>
      <div className="about-card-icon">
        <Flower2 size={23} />
      </div>
      <h2>One story at a time.</h2>
      <p>
        We're starting by helping individuals learn, create
        and share Braille books. For now, makers independently
        contact schools or organisations and arrange donations
        directly. We hope to build meaningful partnerships
        as Bloom in Braille grows.
      </p>
    </article>
  </div>

  <section className="about-belief">
    <span className="card-kicker">A SMALL THOUGHT, A BIGGER PURPOSE</span>
    <h2>
      Not just making books.
      <br />
      <em>Making room for more stories.</em>
    </h2>
    <p>
      We don't expect everyone to know Braille. We simply want
      to make learning about it, creating with it and sharing
      accessible stories a little more approachable.
    </p>
  </section>

  <div className="notice-box">
    <Accessibility size={27} strokeWidth={1.6} />

    <div>
      <b>Accessibility is at the heart of what we do.</b>
      <p>
        We're committed to making Bloom in Braille itself
        accessible through keyboard navigation, screen-reader
        support, readable typography and thoughtful design.
        And because accuracy matters, physical Braille books
        should receive appropriate expert review before donation.
      </p>
    </div>
  </div>
</PageHero>


);
}
