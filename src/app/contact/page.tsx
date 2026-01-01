'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const contactInfo = [
    {
        icon: Mail,
        title: 'Email',
        value: 'hello@careerhub.com',
        href: 'mailto:hello@careerhub.com',
    },
    {
        icon: Phone,
        title: 'Phone',
        value: '+1 (234) 567-890',
        href: 'tel:+1234567890',
    },
    {
        icon: MapPin,
        title: 'Office',
        value: '123 Innovation Drive, San Francisco, CA 94107',
        href: 'https://maps.google.com',
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to submit message');
            }

            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <MessageSquare className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-5 gap-12">
                            {/* Contact Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    Contact Information
                                </h2>
                                {contactInfo.map((info) => (
                                    <a
                                        key={info.title}
                                        href={info.href}
                                        target={info.title === 'Office' ? '_blank' : undefined}
                                        rel={info.title === 'Office' ? 'noopener noreferrer' : undefined}
                                        className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                    >
                                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                                            <info.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {info.title}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {info.value}
                                            </div>
                                        </div>
                                    </a>
                                ))}

                                <div className="pt-6">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                        Business Hours
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Monday - Friday: 9:00 AM - 6:00 PM (PST)<br />
                                        Saturday - Sunday: Closed
                                    </p>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-3">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                                    <AnimatePresence mode="wait">
                                        {isSubmitted ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-12"
                                            >
                                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                    Message Sent!
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                                                </p>
                                                <Button variant="outline" onClick={() => {
                                                    setIsSubmitted(false);
                                                    setFormData({ name: '', email: '', company: '', message: '' });
                                                }}>
                                                    Send Another Message
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <motion.form
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                onSubmit={handleSubmit}
                                                className="space-y-6"
                                            >
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                    Send us a Message
                                                </h2>

                                                {error && (
                                                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                                                        {error}
                                                    </div>
                                                )}

                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <Input
                                                        label="Name *"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="John Doe"
                                                        required
                                                    />
                                                    <Input
                                                        label="Email *"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="john@example.com"
                                                        required
                                                    />
                                                </div>

                                                <Input
                                                    label="Company"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    placeholder="Your company name"
                                                />

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                                        Message *
                                                    </label>
                                                    <textarea
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        rows={5}
                                                        placeholder="How can we help you?"
                                                        required
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-none"
                                                    />
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="w-full sm:w-auto"
                                                    isLoading={isSubmitting}
                                                >
                                                    <Send className="h-4 w-4" />
                                                    Send Message
                                                </Button>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
