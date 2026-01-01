'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
    const plans = [
        {
            name: 'Starter',
            price: '$29',
            period: '/month',
            description: 'Perfect for small teams getting started',
            features: [
                '1 careers page',
                'Up to 10 job listings',
                'Basic customization',
                'Email support',
                'Analytics dashboard',
            ],
        },
        {
            name: 'Professional',
            price: '$99',
            period: '/month',
            description: 'For growing companies with hiring needs',
            features: [
                '5 careers pages',
                'Unlimited job listings',
                'Advanced customization',
                'Priority support',
                'Advanced analytics',
                'Custom domain',
                'API access',
            ],
            popular: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'For large organizations with specific needs',
            features: [
                'Unlimited careers pages',
                'Unlimited job listings',
                'White-label solution',
                'Dedicated support',
                'Custom integrations',
                'SLA guarantee',
                'Training & onboarding',
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="pt-24 pb-16 bg-gradient-to-b from-indigo-50 dark:from-indigo-900/20 to-white dark:to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Choose the perfect plan for your hiring needs. All plans include a 14-day free trial.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`relative p-8 rounded-2xl border-2 ${plan.popular
                                    ? 'border-indigo-600 dark:border-indigo-500 shadow-xl'
                                    : 'border-gray-200 dark:border-gray-700'
                                    } bg-white dark:bg-gray-800`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-indigo-600 text-white text-sm font-medium">
                                            <Sparkles className="h-4 w-4" />
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                        <span className="text-gray-600 dark:text-gray-400 ml-1">{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, fidx) => (
                                        <li key={fidx} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full"
                                    variant={plan.popular ? 'primary' : 'outline'}
                                >
                                    Get Started
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
