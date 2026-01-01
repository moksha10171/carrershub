'use client';

import React from 'react';
import { Activity, CheckCircle, Clock, AlertCircle, TrendingUp, Zap } from 'lucide-react';

export default function StatusPage() {
    const services = [
        { name: 'API Server', status: 'operational', uptime: '99.99%', responseTime: '45ms' },
        { name: 'Website', status: 'operational', uptime: '99.98%', responseTime: '120ms' },
        { name: 'Database', status: 'operational', uptime: '99.95%', responseTime: '12ms' },
        { name: 'CDN', status: 'operational', uptime: '100%', responseTime: '28ms' },
        { name: 'Email Service', status: 'operational', uptime: '99.97%', responseTime: '230ms' },
        { name: 'File Storage', status: 'operational', uptime: '99.99%', responseTime: '85ms' },
    ];

    const metrics = [
        { label: 'Requests/min', value: '12,458', trend: '+5.2%', icon: Zap },
        { label: 'Avg Response Time', value: '89ms', trend: '-12%', icon: Clock },
        { label: 'Uptime (30 days)', value: '99.98%', trend: '+0.02%', icon: TrendingUp },
        { label: 'Error Rate', value: '0.01%', trend: '-34%', icon: CheckCircle },
    ];

    const incidents = [
        {
            title: 'Scheduled Maintenance Completed',
            date: 'Dec 25, 2025',
            time: '02:00 UTC - 03:30 UTC',
            status: 'resolved',
            severity: 'low',
            desc: 'Database maintenance and optimization completed successfully. All systems operating normally.',
            updates: [
                { time: '03:30 UTC', message: 'Maintenance completed. All services restored.' },
                { time: '02:45 UTC', message: 'Database upgrades in progress. Estimated completion: 03:30 UTC.' },
                { time: '02:00 UTC', message: 'Scheduled maintenance started.' },
            ],
        },
        {
            title: 'Elevated API Response Times',
            date: 'Dec 18, 2025',
            time: '14:22 UTC - 15:10 UTC',
            status: 'resolved',
            severity: 'medium',
            desc: 'Brief period of elevated response times due to increased traffic. Resolved by scaling infrastructure.',
            updates: [
                { time: '15:10 UTC', message: 'Response times back to normal. Issue resolved.' },
                { time: '14:45 UTC', message: 'Auto-scaling in progress. Response times improving.' },
                { time: '14:22 UTC', message: 'Investigating elevated response times.' },
            ],
        },
    ];

    const upcomingMaintenance = [
        {
            title: 'Security Patches & Updates',
            date: 'Jan 15, 2026',
            duration: '1 hour',
            impact: 'Minimal - APIs will remain available',
        },
    ];

    const uptimeData = [
        { day: 'Mon', uptime: 100 },
        { day: 'Tue', uptime: 99.99 },
        { day: 'Wed', uptime: 100 },
        { day: 'Thu', uptime: 99.98 },
        { day: 'Fri', uptime: 100 },
        { day: 'Sat', uptime: 100 },
        { day: 'Sun', uptime: 99.97 },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="pt-24 pb-16 bg-gradient-to-b from-green-50 dark:from-green-900/20 to-white dark:to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                        <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        System Status
                    </h1>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
                        <CheckCircle className="h-5 w-5" />
                        All Systems Operational
                    </div>
                </div>
            </section>

            {/* Metrics */}
            <section className="py-16 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            Performance Metrics
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {metrics.map((metric, idx) => (
                                <div
                                    key={idx}
                                    className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <metric.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                        <span className={`text-sm font-medium ${metric.trend.startsWith('+') && !metric.label.includes('Error') ? 'text-green-600 dark:text-green-400' : 'text-green-600 dark:text-green-400'}`}>
                                            {metric.trend}
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                        {metric.value}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {metric.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Status */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Service Status
                        </h2>
                        <div className="space-y-3">
                            {services.map((service, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 gap-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {service.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Response</div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{service.responseTime}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{service.uptime}</div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                                            Operational
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7-Day Uptime */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            7-Day Uptime
                        </h2>
                        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-end justify-between gap-4 h-40">
                                {uptimeData.map((day, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center justify-end group">
                                        <div
                                            className="w-full bg-green-500 dark:bg-green-600 rounded-t hover:bg-green-600 dark:hover:bg-green-500 transition-colors cursor-pointer relative"
                                            style={{ height: `${day.uptime}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                {day.uptime}%
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{day.day}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                Average uptime: 99.99%
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Incidents */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Incident History
                        </h2>
                        <div className="space-y-6">
                            {incidents.map((incident, idx) => (
                                <div
                                    key={idx}
                                    className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                                {incident.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {incident.date} • {incident.time}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${incident.severity === 'low' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                                incident.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                }`}>
                                                {incident.severity}
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                                                {incident.status}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        {incident.desc}
                                    </p>
                                    <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-2 pl-4 space-y-3">
                                        {incident.updates.map((update, uidx) => (
                                            <div key={uidx}>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {update.time}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {update.message}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Maintenance */}
            <section className="py-16 bg-blue-50 dark:bg-blue-900/10 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Scheduled Maintenance
                        </h2>
                        {upcomingMaintenance.map((maint, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-xl bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800"
                            >
                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {maint.title}
                                        </h3>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                            <div><strong>Date:</strong> {maint.date}</div>
                                            <div><strong>Duration:</strong> {maint.duration}</div>
                                            <div><strong>Impact:</strong> {maint.impact}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
