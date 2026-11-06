import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Accessibility,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Calculator,
  CheckCircle2,
  CircleHelp,
  Download,
  FileText,
  Heart,
  Upload,
} from 'lucide-react';

import { guideLinks } from '../data/guides.js';
import { extractDocument, estimateMaterials } from '../lib/intake.js';
import { PageHero } from '../components/Layout.jsx';

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['.txt', '.docx', '.pdf'];

// This is deliberately a limited alphabet-only demonstration.
// It is not a Braille transcription engine.
const demoMap = Object.fromEntries(
  'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .map((letter, index) => [
      letter,
      [
        '⠁', '⠃', '⠉', '⠙', '⠑', '⠋', '⠛', '⠓', '⠊',
        '⠚', '⠅', '⠇', '⠍', '⠝', '⠕', '⠏', '⠟', '⠗',
        '⠎', '⠞', '⠥', '⠧', '⠺', '⠭', '⠽', '⠵',
      ][index],
    ])
);

const demoPunctuation = {
  ' ': '　',
  '\n': '\n',
  ',': '⠂',
  '.': '⠲',
  '?': '⠦',
  '!': '⠖',
  ':': '⠒',
  ';': '⠆',
  '-': '⠤',
};

function createDemoPreview(sourceText) {
  return sourceText
    .toLowerCase()
    .split('')
    .map((character) => (
      demoMap[character] ?? demoPunctuation[character] ?? character
    ))
    .join('');
}

function downloadText(content, filename) {
  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Give the browser time to begin the download before revoking the URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function countWords(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function Content({
  bookmarks = [],
  toggleBookmark,
}) {
  const { section = 'facts' } = useParams();
  const fileRef = useRef(null);

  const [language, setLanguage] = useState('en');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [warning, setWarning] = useState('');
  const [scannedPdf, setScannedPdf] = useState(false);
  const [preview, setPreview] = useState('');
  const [method, setMethod] = useState('manual');
  const [estimate, setEstimate] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [manualWords, setManualWords] = useState(500);
  const [estimateFromText, setEstimateFromText] = useState(true);

  const activeGuide =
    guideLinks.find((item) => item[2] === section) || guideLinks[0];

  const guideBookmark = `guide:${section}`;
  const isBookmarked = bookmarks.includes(guideBookmark);
  const wordCount = estimateFromText ? countWords(text) : manualWords;

  // Load a story passed from the Stories page into Upload & Get.
  useEffect(() => {
    if (section !== 'upload') return;

    const pendingStory = sessionStorage.getItem('bloom-pending-story');
    if (!pendingStory) return;

    try {
      const story = JSON.parse(pendingStory);

      setText(story.text || '');
      setFileName(story.title ? `${story.title} — selected story` : '');
      setStatus(
        'Story loaded from the Stories garden. Review or edit it below before continuing.'
      );
    } catch {
      setStatus('The selected story could not be loaded. Please try again.');
    } finally {
      sessionStorage.removeItem('bloom-pending-story');
    }
  }, [section]);

  const loadFile = async (file) => {
    if (!file) return;

    const extension = `.${file.name.split('.').pop()}`.toLowerCase();

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setStatus('Please choose a TXT, DOCX or PDF file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setStatus('This file is larger than 12 MB. Please choose a smaller file.');
      return;
    }

    setFileName(file.name);
    setStatus('Reading your document locally…');
    setWarning('');
    setScannedPdf(false);
    setPreview('');
    setText('');

    try {
      const extracted = await extractDocument(file);

      setText(extracted.text || '');
      setScannedPdf(Boolean(extracted.scannedPdf));
      setWarning(extracted.warning || '');

      if (extracted.scannedPdf) {
        setStatus(
          'Scanned PDF detected. OCR is needed; this prototype does not run OCR.'
        );
      } else if (extracted.text?.trim()) {
        setStatus(
          'Text extracted. Please review it and correct any extraction issues.'
        );
      } else {
        setStatus(
          'No readable text was found in this file. Try another document or paste your story.'
        );
      }
    } catch (error) {
      setFileName('');
      setText('');
      setStatus(error.message || 'Could not read this document. Please try again.');
    } finally {
      // Allow the same file to be selected again after an error or edit.
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handlePrepare = () => {
    if (!text.trim()) {
      setStatus('Add a story or upload a document first.');
      return;
    }

    if (scannedPdf) {
      setStatus('OCR is required before this scanned PDF can be prepared.');
      return;
    }

    if (language === 'hi') {
      setPreview('');
      setStatus(
        'Hindi/Bharati Braille conversion is not enabled yet. Your extracted Hindi text is preserved for review.'
      );
      return;
    }

    setPreview(createDemoPreview(text));
    setStatus(
      'Demo preview generated. This is not complete or verified Braille transcription.'
    );
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    setPreview('');
    setStatus('');
  };

  const handleEstimate = () => {
    if (!Number.isFinite(wordCount) || wordCount < 1) {
      setEstimate(null);
      setStatus('Enter a valid word count to estimate materials.');
      return;
    }

    setEstimate(estimateMaterials(wordCount, method));
  };

  const toggleChecklistItem = (index) => {
    setCheckedItems((current) => (
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    ));
  };

  const renderFacts = () => (
    <div className="guide-panel">
      <div className="fact-grid">
        <div className="fact-number">
          6
          <span>dots</span>
        </div>

        <div>
          <h2>A tiny cell. A whole world.</h2>
          <p>
            Standard Braille characters are built from a cell of up to six
            raised dots arranged in two columns and three rows. Different dot
            combinations represent letters, numbers, punctuation and more.
          </p>
        </div>
      </div>

      <div className="braille-demo">
        <div
          className="braille-cell"
          role="img"
          aria-label="Illustration of a six-dot Braille cell"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <i key={index} />
          ))}
        </div>

        <div>
          <b>Meet the Braille cell</b>
          <p>
            Each dot has a position. Combinations create distinct characters
            that readers recognise by touch.
          </p>
        </div>
      </div>

      <div className="notice-box">
        <CircleHelp aria-hidden="true" />
        <div>
          <b>Braille is a writing system, not a language.</b>
          <p>
            People use Braille to read and write many languages, with
            conventions that vary by language and context.
          </p>
        </div>
      </div>
    </div>
  );

  const renderWhy = () => {
    const reasons = [
      {
        title: 'Independence',
        description: 'Braille literacy can support independent reading and writing.',
        symbol: '✿',
      },
      {
        title: 'Learning',
        description: 'Access to text helps learners explore language, spelling and ideas.',
        symbol: '☼',
      },
      {
        title: 'Belonging',
        description: 'Sharing stories makes room for more people in our reading communities.',
        symbol: '♡',
      },
    ];

    return (
      <div className="guide-panel">
        <h2>Reading belongs to everyone.</h2>
        <p className="lead">
          Accessible books are not a bonus. They are part of making learning,
          imagination and information available to more people.
        </p>

        <div className="reason-grid">
          {reasons.map((reason) => (
            <div className="reason-card" key={reason.title}>
              <span aria-hidden="true">{reason.symbol}</span>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDiy = () => {
    const instructions = method === 'manual'
      ? [
          'Choose suitable Braille paper and a slate with a matching stylus.',
          'Learn the correct cell layout and follow the writing direction for your slate.',
          'Work slowly, keeping spacing and alignment consistent.',
          'Turn the sheet as required by your slate design and check raised dots from the reading side.',
          'Ask a Braille reader or qualified transcriber to review the finished pages.',
        ]
      : [
          'Find a school, library or partner with access to a Braille embosser.',
          'Prepare a correctly transcribed and formatted BRF or other machine-supported file.',
          'Confirm paper size, line spacing, margins and embosser settings with the operator.',
          'Print a sample page before producing the full book.',
          'Have the physical output checked by a Braille reader or qualified transcriber.',
        ];

    return (
      <div className="guide-panel">
        <div className="method-switch" aria-label="Choose a production method">
          <button
            type="button"
            className={method === 'manual' ? 'active' : ''}
            aria-pressed={method === 'manual'}
            onClick={() => setMethod('manual')}
          >
            Slate &amp; stylus
          </button>
          <button
            type="button"
            className={method === 'embosser' ? 'active' : ''}
            aria-pressed={method === 'embosser'}
            onClick={() => setMethod('embosser')}
          >
            Braille embosser
          </button>
        </div>

        <div className="method-content">
          <span className="card-kicker">
            {method === 'manual'
              ? 'BEGINNER-FRIENDLY METHOD'
              : 'MACHINE-ASSISTED METHOD'}
          </span>

          <h2>
            {method === 'manual'
              ? 'Make each dot by hand.'
              : 'Prepare a file for an embosser.'}
          </h2>

          {instructions.map((instruction, index) => (
            <div className="instruction-row" key={instruction}>
              <span>{index + 1}</span>
              <p>{instruction}</p>
            </div>
          ))}
        </div>

        <div className="notice-box">
          <Accessibility aria-hidden="true" />
          <div>
            <b>Accuracy before distribution</b>
            <p>
              This guide is educational. Embosser settings and slate techniques
              vary. Always have the final book reviewed by someone competent
              in the relevant Braille code.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderUpload = () => (
    <div className="guide-panel">
      <div className="upload-grid">
        <div
          className="upload-box"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            loadFile(event.dataTransfer.files?.[0]);
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.docx,.pdf,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            hidden
            onChange={(event) => loadFile(event.target.files?.[0])}
          />

          <span className="upload-icon">
            <Upload aria-hidden="true" />
          </span>

          <h3>Bring your story along.</h3>
          <p>
            Drop a TXT, DOCX or PDF here, or browse your device.
            Maximum file size: 12 MB.
          </p>

          <button
            type="button"
            className="btn pale"
            onClick={() => fileRef.current?.click()}
          >
            Choose a file
          </button>

          {fileName && (
            <small className="file-name">
              <CheckCircle2 size={14} aria-hidden="true" />
              {fileName}
            </small>
          )}
        </div>

        <div className="language-box">
          <label htmlFor="language">Story language</label>
          <select
            id="language"
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              setPreview('');
              setStatus('');
            }}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>

          <p>
            {language === 'en'
              ? 'The current preview is a limited alphabet demonstration, not full English Braille transcription.'
              : 'Hindi text can be extracted and reviewed, but verified Bharati Braille conversion is not integrated yet.'}
          </p>

          <label htmlFor="storytext">Or paste / edit your story</label>
          <textarea
            id="storytext"
            rows="9"
            value={text}
            onChange={handleTextChange}
            placeholder="Once upon a time…"
          />
        </div>
      </div>

      {status && (
        <p className="status-message" role="status" aria-live="polite">
          {status}
        </p>
      )}

      {warning && (
        <div className="notice-box warning-box">
          <CircleHelp aria-hidden="true" />
          <div>
            <b>OCR needed</b>
            <p>{warning}</p>
          </div>
        </div>
      )}

      {text && (
        <div className="extraction-preview">
          <div className="result-head">
            <div>
              <span className="card-kicker">EXTRACTION PREVIEW</span>
              <h3>Review your story before continuing</h3>
            </div>
            <span>{countWords(text)} words</span>
          </div>

          <p>
            {text.slice(0, 600)}
            {text.length > 600 ? '…' : ''}
          </p>

          <div className="preview-actions">
            <button
              type="button"
              className="btn pale"
              onClick={() => downloadText(text, 'bloom-extracted-story.txt')}
            >
              <Download size={15} />
              Download extracted text
            </button>

            <button
              type="button"
              className="btn primary"
              onClick={handlePrepare}
              disabled={scannedPdf}
            >
              Prepare demo preview
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div className="conversion-result">
          <div className="result-head">
            <div>
              <span className="card-kicker">UNVERIFIED DEMO</span>
              <h3>Unicode Braille character preview</h3>
            </div>

            <button
              type="button"
              className="btn pale"
              onClick={() => downloadText(
                preview,
                'bloom-braille-demo-unverified.txt'
              )}
            >
              <Download size={15} />
              Download text
            </button>
          </div>

          <pre>{preview}</pre>

          <p className="warning-text">
            This alphabet mapping is for interface demonstration only. It does
            not implement Braille grade rules, contractions, numerals,
            capitalization or complete punctuation. Do not print or donate
            this output.
          </p>
        </div>
      )}

      <div className="notice-box">
        <FileText aria-hidden="true" />
        <div>
          <b>Temporary, local processing</b>
          <p>
            This frontend extracts text in your browser and does not upload it
            to a server. Refreshing or closing the tab clears the working text.
            Scanned PDF OCR is not yet included.
          </p>
        </div>
      </div>
    </div>
  );

  const renderEstimate = () => (
    <div className="guide-panel">
      <div className="estimator-form">
        <label htmlFor="production-method">Production method</label>

        <div className="method-switch" id="production-method">
          <button
            type="button"
            className={method === 'manual' ? 'active' : ''}
            aria-pressed={method === 'manual'}
            onClick={() => {
              setMethod('manual');
              setEstimate(null);
            }}
          >
            Manual
          </button>
          <button
            type="button"
            className={method === 'embosser' ? 'active' : ''}
            aria-pressed={method === 'embosser'}
            onClick={() => {
              setMethod('embosser');
              setEstimate(null);
            }}
          >
            Embosser
          </button>
        </div>

        <label htmlFor="estimate-source">Estimate from</label>
        <select
          id="estimate-source"
          value={estimateFromText ? 'story' : 'sample'}
          onChange={(event) => {
            setEstimateFromText(event.target.value === 'story');
            setEstimate(null);
          }}
        >
          <option value="story">
            Current story ({countWords(text)} words)
          </option>
          <option value="sample">Enter word count manually</option>
        </select>

        <label htmlFor="words">Approximate number of words</label>
        <input
          id="words"
          type="number"
          min="1"
          max="100000"
          value={wordCount || ''}
          onChange={(event) => {
            setManualWords(Math.min(
              100000,
              Math.max(1, Number(event.target.value) || 1)
            ));
            setEstimateFromText(false);
            setEstimate(null);
          }}
        />

        <button
          type="button"
          className="btn primary"
          onClick={handleEstimate}
        >
          Estimate my materials
          <Calculator size={17} />
        </button>

        <p className="form-note">
          If you upload or paste a story first, its word count is used
          automatically. You can also enter an approximate count manually.
        </p>
      </div>

      {estimate && (
        <div className="estimate-result" aria-live="polite">
          <span className="card-kicker">INDICATIVE ESTIMATE</span>

          <div className="estimate-total">
            ₹{estimate.total.toLocaleString('en-IN')}
          </div>

          <p>Estimated pages: {estimate.estimatedPages}</p>

          <div className="estimate-list">
            {estimate.items.map((item) => (
              <div key={item.name}>
                <span>
                  {item.name}
                  <small>{item.quantity}</small>
                </span>
                <b>
                  {item.cost
                    ? `₹${item.cost.toLocaleString('en-IN')}`
                    : 'Varies'}
                </b>
              </div>
            ))}
          </div>

          <p className="pages-note">{estimate.assumptions}</p>
        </div>
      )}
    </div>
  );

  const renderNextSteps = () => {
    const checklist = [
      'Ask a qualified Braille reader or transcriber to review the content.',
      'Check that pages are in order and free from smudges, tears or missing lines.',
      'Confirm the binding is secure and does not cover any Braille dots.',
      'Add a clear print title and language label on the cover.',
      'Contact the school or organisation first to confirm its needs and preferred format.',
      'Package the book so pages stay flat and protected during delivery.',
    ];

    return (
      <div className="guide-panel">
        <h2>Before your book finds a new home.</h2>
        <p className="lead">
          A thoughtful check makes a real difference. Work through these
          steps before arranging a donation.
        </p>

        <div className="checklist">
          {checklist.map((item, index) => (
            <label className="check-row" key={item}>
              <input
                type="checkbox"
                checked={checkedItems.includes(index)}
                onChange={() => toggleChecklistItem(index)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <p className="status-message" role="status" aria-live="polite">
          {checkedItems.length} of {checklist.length} checks completed
        </p>

        <div className="notice-box">
          <Heart aria-hidden="true" />
          <div>
            <b>Donate with consent and coordination.</b>
            <p>
              Contact the receiving school or organisation before sending
              anything. Ask what language, level, subject, format and quantity
              they actually need.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const sectionContent = {
    facts: renderFacts,
    why: renderWhy,
    diy: renderDiy,
    upload: renderUpload,
    estimate: renderEstimate,
    next: renderNextSteps,
  };

  const renderActiveSection = sectionContent[section] || renderFacts;

  return (
    <div className="content-layout">
      <aside className="content-sidebar">
        <span className="tiny-label">THE FIELD GUIDE</span>
        <h3>
          Explore &amp;
          <br />
          <em>create.</em>
        </h3>

        <nav aria-label="Field guide sections">
          {guideLinks.map(([title, , slug]) => (
            <Link
              key={slug}
              to={`/content/${slug}`}
              className={`side-link ${section === slug ? 'selected' : ''}`}
              aria-current={section === slug ? 'page' : undefined}
            >
              <span>{title}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <div className="sidebar-note">
          <span aria-hidden="true">✿</span>
          <p>Take your time. Every new skill starts with a first step.</p>
        </div>
      </aside>

      <section className="content-main">
        <div className="content-title">
          <span className="tiny-label">
            BLOOM FIELD GUIDE / {activeGuide[0].toUpperCase()}
          </span>

          <h1>{activeGuide[0]}</h1>
          <p>{activeGuide[1]}</p>

          <button
            type="button"
            className="bookmark-inline"
            onClick={() => toggleBookmark?.(guideBookmark)}
            aria-pressed={isBookmarked}
          >
            {isBookmarked
              ? <BookmarkCheck size={16} />
              : <Bookmark size={16} />}
            {isBookmarked ? 'Bookmarked' : 'Bookmark this guide'}
          </button>
        </div>

        {renderActiveSection()}
      </section>
    </div>
  );
}
