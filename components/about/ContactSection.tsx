"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, UserIcon, Mail02Icon } from "@hugeicons/core-free-icons";

type Field = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Field>;

const CONTACT_EMAIL = "hello@tripvibee.com";

export default function ContactSection() {
    const [form, setForm] = useState<Field>({ name: "", email: "", subject: "", message: "" });
    const [errors, setErrors] = useState<Errors>({});
    const [submitted, setSubmitted] = useState(false);

    const validate = (): boolean => {
        const e: Errors = {};
        if (!form.name.trim()) e.name = "Name is required.";
        if (!form.email.trim()) {
            e.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            e.email = "Enter a valid email address.";
        }
        if (!form.subject.trim()) e.subject = "Subject is required.";
        if (!form.message.trim()) {
            e.message = "Message is required.";
        } else if (form.message.trim().length < 20) {
            e.message = "Message must be at least 20 characters.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const body = `Hi TripVibee Team,\n\nMy name is ${form.name}.\n\n${form.message}\n\nRegards,\n${form.name}\n${form.email}`;
        const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        setSubmitted(true);
    };

    const set = (field: keyof Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
    };

    return (
        <section id="contact" className="mx-3 sm:mx-4 xl:mx-6 mt-4 mb-8 grid grid-cols-1 xl:grid-cols-2 gap-0 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

            {/* Left — info panel */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-7 sm:p-10 flex flex-col gap-6 text-white">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-purple-200 mb-2">Get in Touch</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                        We'd love to hear<br />from you ✈️
                    </h2>
                    <p className="text-sm text-purple-100 mt-3 leading-relaxed max-w-xs">
                        Have a question, suggestion, or just want to say hello? Fill the form and we'll open your email client with everything pre-filled — ready to send!
                    </p>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    {[
                        { icon: Mail01Icon, label: "Email us at", value: CONTACT_EMAIL },
                        { icon: Mail02Icon, label: "We reply within", value: "24–48 hours" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                                <HugeiconsIcon icon={item.icon} size={16} strokeWidth={1.8} className="text-white" />
                            </span>
                            <div>
                                <p className="text-[11px] text-purple-200">{item.label}</p>
                                <p className="text-sm font-semibold">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decorative dashed path */}
                <svg className="mt-auto opacity-20" viewBox="0 0 200 40" fill="none">
                    <path d="M0 20 C 50 5, 100 35, 150 20 S 180 5 200 20" stroke="white" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
                </svg>
            </div>

            {/* Right — form */}
            <div className="p-7 sm:p-10">
                {submitted ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
                        <span className="text-5xl">📬</span>
                        <h3 className="text-xl font-bold text-gray-900">Your email client is opening!</h3>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Your message to <span className="font-semibold text-purple-600">{CONTACT_EMAIL}</span> is pre-filled and ready to send.
                        </p>
                        <button
                            onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setSubmitted(false); }}
                            className="mt-2 text-sm text-purple-600 font-semibold hover:underline"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                        <h3 className="text-lg font-bold text-gray-900">Send us a message</h3>

                        {/* Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Your Name</label>
                            <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-purple-100 ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus-within:border-purple-400 focus-within:bg-white"}`}>
                                <HugeiconsIcon icon={UserIcon} size={15} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Ananya Sharma"
                                    value={form.name}
                                    onChange={set("name")}
                                    className="bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 flex-1"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
                            <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-purple-100 ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus-within:border-purple-400 focus-within:bg-white"}`}>
                                <HugeiconsIcon icon={Mail01Icon} size={15} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={set("email")}
                                    className="bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 flex-1"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Subject */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject</label>
                            <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-purple-100 ${errors.subject ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus-within:border-purple-400 focus-within:bg-white"}`}>
                                <input
                                    type="text"
                                    placeholder="I have a question about..."
                                    value={form.subject}
                                    onChange={set("subject")}
                                    className="bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 flex-1"
                                />
                            </div>
                            {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Message</label>
                            <div className={`rounded-xl border px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-purple-100 ${errors.message ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus-within:border-purple-400 focus-within:bg-white"}`}>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us what's on your mind... (min 20 characters)"
                                    value={form.message}
                                    onChange={set("message")}
                                    className="bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 w-full resize-none"
                                />
                            </div>
                            {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl py-3 transition-colors flex items-center justify-center gap-2"
                        >
                            <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={2} />
                            Open in Email Client →
                        </button>

                        <p className="text-[11px] text-gray-400 text-center">
                            This will open your default email app with the message pre-filled.
                        </p>
                    </form>
                )}
            </div>

        </section>
    );
}
