
import { NextResponse } from 'next/server';
import { advancedAnalysisFlow } from '@/ai/flows/advanced-analysis-flow';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await advancedAnalysisFlow.run(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Advanced analysis error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
