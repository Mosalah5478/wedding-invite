import { useEffect, useMemo, useState } from "react";
import "./App.css";
const BASE_URL = import.meta.env.BASE_URL;

const countdownTarget = new Date("2026-05-02T18:00:00");
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzdygbwg";
const eventCards = [
  {
    title: "Henna Night",
    date: "May 2, 2026",
    time: "8:00 PM",
    venue: "Al Yashmak Hall",
    city: "Al Arish, North Sinai",
    directionLabel: "Get Directions ↗",
    locationUrl: "https://maps.google.com/?q=Al+Yashmak+Hall+Al+Arish",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Al+Yashmak+Hall+Al+Arish&output=embed",
  },
  {
    title: "Wedding Party",
    date: "May 2, 2026",
    time: "6:00 PM",
    venue: "Armed Forces Hotel",
    city: "Al Arish, North Sinai",
    directionLabel: "Get Directions ↗",
    locationUrl: "https://maps.google.com/?q=Armed+Forces+Hotel+Al+Arish",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Armed+Forces+Hotel+Al+Arish&output=embed",
  },
];

const storyItems = [
  {
    title: "How We Met",
    text: "This section is ready for your real story. Replace the text with your own words and keep the same elegant layout.",
  },
  {
    title: "The Proposal",
    text: "Use this card for the proposal story or a short romantic memory that means a lot to both of you.",
  },
  {
    title: "The Next Chapter",
    text: "A final heartfelt message before the event details, gallery, and RSVP section.",
  },
];

const BASE_URL = import.meta.env.BASE_URL;

const galleryItems = [
  {
    title: "A Toast",
    subtitle: "To love and joy",
    image: `${BASE_URL}images/Png1.jpeg`,
  },
  {
    title: "Forever Starts",
    subtitle: "A beautiful promise",
    image: `${BASE_URL}images/Png2.jpeg`,
  },
  {
    title: "A Lovely Memory",
    subtitle: "Our favorite moment",
    image: `${BASE_URL}images/Png3.jpeg`,
  },
  {
    title: "Together",
    subtitle: "A timeless chapter",
    image: `${BASE_URL}images/Png4.jpeg`,
  },
];

const faqItems = [
  {
    q: "Can I confirm attendance through the website?",
    a: "Yes. This front-end version is ready, and it can later be connected to WhatsApp, email, Google Sheets, or your own backend.",
  },
  {
    q: "Can all names, dates, and images be changed?",
    a: "Yes. Every title, paragraph, event, image, and button can be edited easily from the code.",
  },
  {
    q: "Can a Google Maps location be added?",
    a: "Yes. The directions button and the embedded map can both be changed easily.",
  },
];

function getTimeLeft() {
  const now = new Date();
  const diff = countdownTarget - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function SectionHeading({ overline, title, text }) {
  return (
    <div className="section-heading reveal">
      <p className="section-overline">{overline}</p>
      <h2>{title}</h2>
      <div className="section-divider">
        <span></span>
        <span className="heart-dot">♥</span>
        <span></span>
      </div>
      <p className="section-text">{text}</p>
    </div>
  );
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEventIndex, setSelectedEventIndex] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    guests: "",
    attendance: "Attending",
    note: "",
  });

  const floatingHearts = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${5 + i * 7}%`,
      delay: `${i * 0.7}s`,
      duration: `${8 + (i % 4)}s`,
      size: `${12 + (i % 3) * 4}px`,
    }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const value = height > 0 ? (scrollTop / height) * 100 : 0;
      setProgress(value);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
    }, 5000);

    return () => clearInterval(slider);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

          async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitted(false);

        try {
          const response = await fetch(FORMSPREE_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              fullName: formData.fullName,
              guests: formData.guests,
              attendance: formData.attendance,
              note: formData.note,
            }),
          });

          if (!response.ok) {
            throw new Error("Form submission failed");
          }

          setSubmitted(true);
          setFormData({
            fullName: "",
            guests: "",
            attendance: "Attending",
            note: "",
          });
        } catch (error) {
          console.error(error);
          alert("Something went wrong while sending the RSVP.");
        } finally {
          setIsSubmitting(false);
        }
      }

  function goToNext() {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  }

  function goToPrev() {
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  }

  const activeSlide = galleryItems[currentSlide];
  const selectedEvent = eventCards[selectedEventIndex];

  return (
    <div className="site-page">
      <div className="scroll-progress">
        <span style={{ width: `${progress}%` }}></span>
      </div>

      <div className="bg-hearts" aria-hidden="true">
        {floatingHearts.map((item) => (
          <span
            key={item.id}
            className="bg-heart"
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
              fontSize: item.size,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      <div className="phone-frame">
        <header className="site-header">
          <div className="site-header-top">
            <div className="brand-mark">
              L<span>&</span>K
            </div>
          </div>

          <nav className="main-nav">
            <a href="#home">Home</a>
            <a href="#story">Our Story</a>
            <a href="#details">Details</a>
            <a href="#gallery">Gallery</a>
            <a href="#rsvp">RSVP</a>
          </nav>
        </header>

        <main className="page-content">
          <section id="home" className="hero-section reveal">
            <div className="hero-card">
              <div className="hero-overlay">
                <p className="hero-kicker">WITH JOY IN OUR HEARTS</p>
                <h1>
                  Layla <span>&</span> Kareem
                </h1>
                <p className="hero-paragraph">
                  We are delighted to invite you to celebrate our wedding day and share with us the beginning of our new chapter together.
                </p>
                <div className="hero-badge">Saturday — May 2, 2026</div>
              </div>
            </div>
          </section>

          <section className="welcome-section reveal">
            <div className="welcome-card">
              <div className="welcome-top-line"></div>
              <p className="welcome-mini">WELCOME TO OUR WEDDING WEBSITE</p>
              <h2>A Warm Invitation</h2>
              <p className="welcome-text">
                Welcome to our wedding website. We are so happy to share this beautiful season of our lives with the people we love most. Your presence, your wishes, and your support mean everything to us.
              </p>
              <div className="welcome-signature">
                <span>With love</span>
                <strong>Layla & Kareem</strong>
              </div>
            </div>
          </section>

          <section className="section-block reveal">
            <div className="countdown-card">
              <SectionHeading
                overline="COUNTDOWN"
                title="Countdown To Our Day"
                text="The timer below counts down automatically to the exact target date written in the code."
              />

              <div className="countdown-grid">
                <div className="count-item">
                  <strong>{String(timeLeft.days).padStart(2, "0")}</strong>
                  <span>Days</span>
                </div>
                <div className="count-item">
                  <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                  <span>Hours</span>
                </div>
                <div className="count-item">
                  <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                  <span>Minutes</span>
                </div>
                <div className="count-item">
                  <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                  <span>Seconds</span>
                </div>
              </div>
            </div>
          </section>

          <section id="story" className="section-block">
            <SectionHeading
              overline="OUR STORY"
              title="Our Story"
              text="Elegant story cards arranged in a calm vertical flow, ready for your own real content."
            />

            <div className="story-list">
              {storyItems.map((item, index) => (
                <div className="story-card reveal" key={item.title}>
                  <div className="story-index">{index + 1}</div>
                  <div className="story-content">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="details" className="section-block">
            <SectionHeading
              overline="WHEN & WHERE"
              title="When & Where"
              text="A refined event layout inspired by the original design, including multiple event cards and an embedded map."
            />

            <div className="event-stack">
              {eventCards.map((event, index) => (
                <div className="event-main-card reveal" key={event.title}>
                  <h3>{event.title}</h3>
                  <div className="event-list">
                    <div className="event-row">{event.date}</div>
                    <div className="event-row">{event.time}</div>
                    <div className="event-row">{event.venue}</div>
                    <div className="event-row">{event.city}</div>
                  </div>

                  <div className="card-actions">
                    <a
                      className="inline-link"
                      href={event.locationUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ♥ {event.directionLabel}
                    </a>

                    <button
                      type="button"
                      className={`mini-map-btn ${selectedEventIndex === index ? "active" : ""}`}
                      onClick={() => setSelectedEventIndex(index)}
                    >
                      Show on Map
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="calendar-banner reveal">📅 Add To Calendar</div>

            <div id="map-box" className="map-card reveal">
              <div className="map-toolbar">
                {selectedEvent.venue} — {selectedEvent.city}
              </div>

              <iframe
                title="Wedding Location"
                src={selectedEvent.mapEmbedUrl}
                width="100%"
                height="420"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>

          <section id="gallery" className="section-block">
            <SectionHeading
              overline="GALLERY"
              title="Gallery"
              text="A softer slider block inspired by the original website, with navigation arrows and dots below the image."
            />

            <div className="gallery-slider-card reveal">
              <div
                className="gallery-photo single-slide"
                style={{ backgroundImage: `url(${activeSlide.image})` }}
              >
                <div className="gallery-photo-overlay"></div>
                <div className="gallery-text-overlay">
                  <p>{activeSlide.title}</p>
                  <span>{activeSlide.subtitle}</span>
                </div>
              </div>

              <div className="gallery-controls">
                <span className="decor-heart">♥</span>

                <button
                  type="button"
                  className="nav-arrow dark-circle"
                  onClick={goToPrev}
                  aria-label="Previous slide"
                >
                  ←
                </button>

                <div className="slider-dots">
                  {galleryItems.map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`dot ${currentSlide === index ? "active" : ""}`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    ></button>
                  ))}
                </div>

                <button
                  type="button"
                  className="nav-arrow light-circle"
                  onClick={goToNext}
                  aria-label="Next slide"
                >
                  →
                </button>
              </div>
            </div>
          </section>

          <section className="section-block">
            <SectionHeading
              overline="FAQ"
              title="Frequently Asked Questions"
              text="Styled to feel closer to the invitation design while keeping the interaction clean and simple."
            />

            <div className="faq-list">
              {faqItems.map((item, index) => (
                <div
                  className={`faq-card ${openFaq === index ? "active" : ""}`}
                  key={item.q}
                >
                  <button
                    className="faq-question"
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-sign">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>

                  <div className={`faq-answer-wrap ${openFaq === index ? "open" : ""}`}>
                    <div className="faq-answer">{item.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="rsvp" className="section-block reveal">
            <div className="rsvp-card">
              <SectionHeading
                overline="RSVP"
                title="Confirm Your Attendance"
                text="Right now this form is a visual demo only. It does not send the name anywhere until it is connected to a real service."
              />

              <div className="attendance-switcher">
                {["Attending", "Maybe", "Can’t attend"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`attendance-pill ${formData.attendance === option ? "active" : ""}`}
                    onClick={() => setFormData((prev) => ({ ...prev, attendance: option }))}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <form className="rsvp-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="guests"
                  placeholder="Number of guests"
                  value={formData.guests}
                  onChange={handleChange}
                />
                <textarea
                  name="note"
                  placeholder="Write your message"
                  value={formData.note}
                  onChange={handleChange}
                ></textarea>

                <button
                  type="submit"
                  className="btn dark-btn full-width"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit RSVP"}
                </button>
              </form>

              {submitted && (
                <div className="success-message">
                  Demo form submitted successfully on the page. To make it really send names, the form needs to be connected to EmailJS, Google Sheets, WhatsApp, or a backend.
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
