'use client';

import { useState, useRef } from 'react';

import { Eyebrow } from '@/components/ui/Eyebrow';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useEffect } from 'react';

const HATCHET_WEBHOOK_URL = process.env.NEXT_PUBLIC_HATCHET_WEBHOOK_URL || '';
const HATCHET_TOPIC = 'wordpress:lead_captured';

interface FormData {
  'first-name': string;
  'last-name': string;
  phone: string;
  'your-email': string;
  company: string;
  'company-website': string;
  function: string;
  'product-interest': string;
  message: string;
  'gdpr-consent': boolean;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  'first-name': '',
  'last-name': '',
  phone: '',
  'your-email': '',
  company: '',
  'company-website': '',
  function: '',
  'product-interest': '',
  message: '',
  'gdpr-consent': false,
};

export function ContactForm() {
  const t = (key: string) => key;
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      '.bl-form__content > *',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData['first-name'].trim()) newErrors['first-name'] = 'Required';
    if (!formData['last-name'].trim()) newErrors['last-name'] = 'Required';
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData['your-email'].trim()) {
      newErrors['your-email'] = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData['your-email'])) {
      newErrors['your-email'] = 'Invalid email';
    }
    if (!formData.function) newErrors.function = 'Required';
    if (!formData.message.trim()) newErrors.message = 'Required';
    if (!formData['gdpr-consent']) newErrors['gdpr-consent'] = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const payload = {
        topic: HATCHET_TOPIC,
        data: {
          firstName: formData['first-name'],
          lastName: formData['last-name'],
          phone: formData.phone,
          email: formData['your-email'],
          company: formData.company || undefined,
          companyWebsite: formData['company-website'] || undefined,
          function: formData.function,
          productInterest: formData['product-interest'] || undefined,
          message: formData.message,
          gdprConsent: formData['gdpr-consent'],
          source: 'belinus-website',
          timestamp: new Date().toISOString(),
        },
      };

      if (HATCHET_WEBHOOK_URL) {
        await fetch(HATCHET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setStatus('success');
      setFormData(initialFormData);
    } catch (err) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or email us directly.');
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  if (status === 'success') {
    return (
      <section ref={sectionRef} id="contact" className="py-24 md:py-32 px-6 bg-black">
        <div className="max-w-xl mx-auto text-center bl-form__content">
          <Eyebrow>Thank you</Eyebrow>
          <h2 className="text-[clamp(28px,4vw,48px)] font-black text-white mb-4">
            We&apos;ll be in touch.
          </h2>
          <p className="text-white/50">
            Thank you for your interest. We&apos;ll review your message and get back to you within one business day.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="contact" className="py-24 md:py-32 px-6 bg-black">
      <div className="max-w-3xl mx-auto bl-form__content">
        <div className="text-center mb-12">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="text-[clamp(28px,4vw,48px)] font-black leading-[1.1] tracking-[-0.02em] text-white mb-4">
            {t('headline')}
          </h2>
          <p className="text-white/50 text-[17px]">{t('subhead')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="First Name"
              name="first-name"
              type="text"
              value={formData['first-name']}
              onChange={handleChange}
              error={errors['first-name']}
              required
              placeholder="First Name"
            />
            <FormField
              label="Last Name"
              name="last-name"
              type="text"
              value={formData['last-name']}
              onChange={handleChange}
              error={errors['last-name']}
              required
              placeholder="Last Name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              placeholder="+31 6 12345678"
            />
            <FormField
              label="Email"
              name="your-email"
              type="email"
              value={formData['your-email']}
              onChange={handleChange}
              error={errors['your-email']}
              required
              placeholder="email@company.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Company (optional)"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company name"
            />
            <FormField
              label="Company Website (optional)"
              name="company-website"
              type="url"
              value={formData['company-website']}
              onChange={handleChange}
              placeholder="https://www.company.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Function"
              name="function"
              type="select"
              value={formData.function}
              onChange={handleChange}
              error={errors.function}
              required
              options={[
                { value: '', label: 'Select function' },
                { value: 'CEO', label: 'CEO' },
                { value: 'CTO', label: 'CTO' },
                { value: 'CFO', label: 'CFO' },
                { value: 'Operations Manager', label: 'Operations Manager' },
                { value: 'Procurement Manager', label: 'Procurement Manager' },
                { value: 'Technical Manager', label: 'Technical Manager' },
                { value: 'Sales Manager', label: 'Sales Manager' },
                { value: 'Marketing Manager', label: 'Marketing Manager' },
                { value: 'Project Manager', label: 'Project Manager' },
                { value: 'Engineer', label: 'Engineer' },
                { value: 'Consultant', label: 'Consultant' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <FormField
              label="Product Interest"
              name="product-interest"
              type="select"
              value={formData['product-interest']}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select product interest' },
                { value: 'Energywall G1', label: 'Energywall G1' },
                { value: 'Energy Management System', label: 'Energy Management System' },
                { value: 'Commercial Building', label: 'Commercial Building' },
                { value: 'Industrial / Manufacturing', label: 'Industrial / Manufacturing' },
                { value: 'Installer Program', label: 'Installer Program' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>

          <FormField
            label="Message"
            name="message"
            type="textarea"
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
            required
            placeholder="Your question..."
          />

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="gdpr-consent"
                checked={formData['gdpr-consent']}
                onChange={handleChange}
                className="mt-1 accent-accent"
              />
              <span className="text-[13px] text-white/55 leading-relaxed">
                I agree to the Privacy Policy and consent to being contacted regarding my inquiry.
              </span>
            </label>
            {errors['gdpr-consent'] && (
              <p className="text-red-400 text-xs mt-1">{errors['gdpr-consent']}</p>
            )}
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-accent text-black font-bold text-sm tracking-widest uppercase py-4 px-10 hover:bg-transparent hover:text-accent border-2 border-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      </div>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  error,
  required,
  placeholder,
  options,
}: FormFieldProps) {
  const id = `field-${name}`;

  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-white/70 mb-2">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-[#141414] border text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors ${
            error ? 'border-red-400' : 'border-white/[0.08]'
          }`}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-3 bg-[#141414] border text-white text-sm focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer ${
            error ? 'border-red-400' : 'border-white/[0.08]'
          } ${!value ? 'text-white/30' : ''}`}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-[#141414] border text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors ${
            error ? 'border-red-400' : 'border-white/[0.08]'
          }`}
        />
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
