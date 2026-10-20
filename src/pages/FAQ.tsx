import { Link } from 'react-router-dom';
import ContentPage from '../components/ContentPage';

// Placeholder answers: edit to match your real products and policies.
const faqs: [string, React.ReactNode][] = [
  ['How do I find a wrap for my phone?', 'Open any wrap, choose your phone brand, then your model. Only models the wrap is made for are listed.'],
  ['Can I order the same wrap for two phones?', 'Yes. Add it once per phone. Each cart line keeps its own brand and model.'],
  ['How do I apply a wrap?', 'Clean and dry the phone, line up the wrap with the camera cutout, and smooth it down from one edge. Add your own step-by-step guide here.'],
  ['Where is my order?', 'You will get a confirmation email after checkout, and a tracking email once it ships.'],
  ['What if I ordered the wrong model?', <>Contact us quickly and we will help. See our <Link to="/returns" className="underline">returns policy</Link>.</>],
];

export default function FAQ() {
  return (
    <ContentPage title="Frequently asked questions">
      <div className="divide-y divide-mist border-y border-mist">
        {faqs.map(([q, a]) => (
          <details key={q} className="py-5">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-3 text-stone">{a}</p>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}
