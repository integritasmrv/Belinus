'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const HATCHET_WEBHOOK_URL = process.env.NEXT_PUBLIC_HATCHET_WEBHOOK_URL || '';
const HATCHET_TOPIC = 'wordpress:lead_captured';

interface FormData { [key: string]: string | boolean; }

const initial: FormData = {
  'first-name': '', 'last-name': '', phone: '', 'your-email': '',
  company: '', 'company-website': '', function: '', 'product-interest': '',
  message: '', 'gdpr-consent': false,
};

export function ContactForm() {
  const t = useTranslations('contact');
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo('.bl-form__content > *', { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form['first-name']) e['first-name'] = 'Required';
    if (!form['last-name']) e['last-name'] = 'Required';
    if (!form.phone) e.phone = 'Required';
    if (!form['your-email']) e['your-email'] = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form['your-email'] as string)) e['your-email'] = 'Invalid email';
    if (!form.function) e.function = 'Required';
    if (!form.message) e.message = 'Required';
    if (!form['gdpr-consent']) e['gdpr-consent'] = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    setErrorMsg('');
    try {
      const payload = {
        topic: HATCHET_TOPIC,
        data: {
          firstName: form['first-name'], lastName: form['last-name'],
          phone: form.phone, email: form['your-email'],
          company: form.company || undefined, companyWebsite: form['company-website'] || undefined,
          function: form.function, productInterest: form['product-interest'] || undefined,
          message: form.message, gdprConsent: form['gdpr-consent'],
          source: 'belinus-website', timestamp: new Date().toISOString(),
        },
      };
      if (HATCHET_WEBHOOK_URL) {
        await fetch(HATCHET_WEBHOOK_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
      }
      setStatus('success');
      setForm(initial);
    } catch { setStatus('error'); setErrorMsg('Something went wrong. Please try again or email us directly.'); }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((p) => ({ ...p, [name]: val }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  }

  if (status === 'success') return (
    <section ref={sectionRef} id="contact" className="py-24 md:py-32 px-6 bg-black">
      <div className="max-w-xl mx-auto text-center bl-form__content">
        <Eyebrow>Thank you</Eyebrow>
        <h2 className="text-[clamp(28px,4vw,48px)] font-black text-white mb-4">We&apos;ll be in touch.</h2>
        <p className="text-white/50">Thank you for your interest. We&apos;ll review your message and get back to you within one business day.</p>
      </div>
    </section>
  );

  return (
    <section ref={sectionRef} id="contact" className="py-24 md:py-32 px-6 bg-black">
      <div className="max-w-3xl mx-auto bl-form__content">
        <div className="text-center mb-12">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="text-[clamp(28px,4vw,48px)] font-black leading-[1.1] tracking-[-0.02em] text-white mb-4">{t('headline')}</h2>
          <p className="text-white/50 text-[17px]">{t('subhead')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="First Name" name="first-name" type="text" value={form['first-name'] as string} onChange={handleChange} error={errors['first-name']} required placeholder="First Name" />
            <Field label="Last Name" name="last-name" type="text" value={form['last-name'] as string} onChange={handleChange} error={errors['last-name']} required placeholder="Last Name" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Phone" name="phone" type="tel" value={form.phone as string} onChange={handleChange} error={errors.phone} required placeholder="+31 6 12345678" />
            <Field label="Email" name="your-email" type="email" value={form['your-email'] as string} onChange={handleChange} error={errors['your-email']} required placeholder="email@company.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company (optional)" name="company" type="text" value={form.company as string} onChange={handleChange} placeholder="Company name" />
            <Field label="Company Website (optional)" name="company-website" type="url" value={form['company-website'] as string} onChange={handleChange} placeholder="https://www.company.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectField label="Function" name="function" value={form.function as string} onChange={handleChange} error={errors.function} required options={[{v:'',l:'Select function'},{v:'CEO',l:'CEO'},{v:'CTO',l:'CTO'},{v:'CFO',l:'CFO'},{v:'Operations Manager',l:'Operations Manager'},{v:'Procurement Manager',l:'Procurement Manager'},{v:'Technical Manager',l:'Technical Manager'},{v:'Sales Manager',l:'Sales Manager'},{v:'Marketing Manager',l:'Marketing Manager'},{v:'Project Manager',l:'Project Manager'},{v:'Engineer',l:'Engineer'},{v:'Consultant',l:'Consultant'},{v:'Other',l:'Other'}]} />
            <SelectField label="Product Interest" name="product-interest" value={form['product-interest'] as string} onChange={handleChange} options={[{v:'',l:'Select product interest'},{v:'Energywall G1',l:'Energywall G1'},{v:'Energy Management System',l:'Energy Management System'},{v:'Commercial Building',l:'Commercial Building'},{v:'Industrial / Manufacturing',l:'Industrial / Manufacturing'},{v:'Installer Program',l:'Installer Program'},{v:'Other',l:'Other'}]} />
          </div>
          <TextareaField label="Message" name="message" value={form.message as string} onChange={handleChange} error={errors.message} required placeholder="Your question..." />
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="gdpr-consent" checked={form['gdpr-consent'] as boolean} onChange={handleChange} className="mt-1 accent-accent" />
              <span className="text-[13px] text-white/55 leading-relaxed">I agree to the Privacy Policy and consent to being contacted regarding my inquiry.</span>
            </label>
            {errors['gdpr-consent'] && <p className="text-red-400 text-xs mt-1">{errors['gdpr-consent']}</p>}
          </div>
          {status === 'error' && <p className="text-red-400 text-sm">{errorMsg}</p>}
          <button type="submit" disabled={status === 'submitting'} className="w-full bg-accent text-black font-bold text-sm tracking-widest uppercase py-4 px-10 hover:bg-transparent hover:text-accent border-2 border-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      </div>
    </section>
  );
}

interface FieldProps { label: string; name: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; error?: string; required?: boolean; placeholder?: string; }

interface SelectFieldProps { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; error?: string; required?: boolean; options: {v:string,l:string}[]; }

interface TextareaFieldProps { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; error?: string; required?: boolean; placeholder?: string; }

function Field({ label, name, type, value, onChange, error, required, placeholder }: FieldProps) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-white/70 mb-2">{label}{required && <span className="text-accent ml-1">*</span>}</label>
      <input id={id} name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder}
        className={`w-full px-4 py-3 bg-[#141414] border text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors ${error ? 'border-red-400' : 'border-white/[0.08]'}`} />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function TextareaField({ label, name, value, onChange, error, required, placeholder }: TextareaFieldProps) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-white/70 mb-2">{label}{required && <span className="text-accent ml-1">*</span>}</label>
      <textarea id={id} name={name} value={value} onChange={onChange} rows={5} required={required} placeholder={placeholder}
        className={`w-full px-4 py-3 bg-[#141414] border text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors ${error ? 'border-red-400' : 'border-white/[0.08]'}`} />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, required, options }: SelectFieldProps) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-white/70 mb-2">{label}{required && <span className="text-accent ml-1">*</span>}</label>
      <select id={id} name={name} value={value} onChange={onChange} required={required}
        className={`w-full px-4 py-3 bg-[#141414] border text-white text-sm focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer ${error ? 'border-red-400' : 'border-white/[0.08]'} ${!value ? 'text-white/30' : ''}`}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
