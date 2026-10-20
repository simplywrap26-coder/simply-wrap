import { Link } from 'react-router-dom';
import ContentPage from '../components/ContentPage';

export default function About() {
  return (
    <ContentPage title="About Simply Wrap" intro="Premium vinyl wraps that give your phone a new look.">
      {/* Placeholder copy: replace with your own story. */}
      <div className="space-y-5 leading-relaxed text-stone">
        <p>Simply Wrap makes vinyl skins and wraps for smartphones. Each design is cut for a specific phone model, so it fits the way it should.</p>
        <p>Pick a wrap, choose your phone brand and model, and we only offer designs that are made for your device.</p>
        <p>Have a question about fit or finish? <Link to="/contact" className="text-ink underline underline-offset-4">Get in touch</Link>.</p>
      </div>
    </ContentPage>
  );
}
