'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { runFlow } from '@genkit-ai/react-sdk/client'; 

// Since I don't have the SDK installed/configured in the file list (I saw @genkit-ai/next in package.json),
// I will use a standard fetch to the flow endpoint.
// Genkit flows are typically exposed at /api/genkit/<flowName>

export function AskHealthData() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAsk = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setError('');
        setAnswer('');

        try {
            // Assuming the flow is exposed via the standard Genkit API route
            // The path might be /api/genkit/askHealthDataFlow or similar depending on config.
            // Based on typical Genkit + Next.js setup:
            const response = await fetch('/api/genkit/askHealthDataFlow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: { question } }),
            });

            if (!response.ok) {
                throw new Error('Failed to get answer');
            }

            const result = await response.json();
            // Result structure depends on Genkit version, usually result.result
            setAnswer(result.result.answer);
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching the answer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Ask AI about Health Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="e.g., What is the trend in Jakarta Pusat?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    />
                    <Button onClick={handleAsk} disabled={loading}>
                        {loading ? 'Asking...' : 'Ask'}
                    </Button>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                {answer && (
                    <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                        <h3 className="font-semibold mb-2">Answer:</h3>
                        {answer}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
