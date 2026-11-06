import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { PageHero } from '../components/Layout.jsx';

const CONTACT_EMAIL = 'chaudharysuraksha01@gmail.com';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'General question',
    message: '',
  });

  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setSent(false);
  };

  const submit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Bloom in Braille | ${form.topic}`
    );

    const body = encodeURIComponent(
      `Hello Bloom in Braille Team,

Name: ${form.name}
Email: ${form.email}
Topic: ${form.topic}

Message:
${form.message}

Regards,
${form.name}`
    );

    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <PageHero
      eyebrow="SAY HELLO"
      title={
        <>
          A note, a thought, <em>a hello.</em>
        </>
      }
      intro="Have a question, an idea or a potential collaboration? We'd love to hear from you."
    >
      <div className="contact-details">
        <div className="contact-email-card">
          <span className="contact-icon">
            <Mail size={20} />
          </span>

          <div>
            <p className="contact-label">DROP US AN EMAIL</p>

            <a href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>

      <form className="contact-form" onSubmit={submit}>
        <div className="form-row">
          <label>
            Your name
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your lovely name"
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>
        </div>

        <label>
          What would you like to talk about?
          <select
            name="topic"
            value={form.topic}
            onChange={handleChange}
          >
            <option>General question</option>
            <option>School or organisation collaboration</option>
            <option>Accessibility feedback</option>
            <option>Story contribution</option>
          </select>
        </label>

        <label>
          Your message
          <textarea
            name="message"
            required
            rows="6"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your thoughts here..."
          />
        </label>

        <button type="submit" className="btn primary">
          <Send size={16} />
          Prepare message
        </button>

        {sent ? (
          <p className="status-message" role="status">
            Your email application should open with your message prepared.
            Please review and send it from there.
          </p>
        ) : (
          <p className="form-note">
            Your message will be addressed to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            . It will not be sent until you confirm it in your email application.
          </p>
        )}
      </form>
    </PageHero>
  );
}