import { NextRequest, NextResponse } from 'next/server';
import { aiOrchestratorService } from '@/server/src/modules/ai/ai-orchestrator.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roleType = 'advisor', userQuery, studentContext } = body;

    if (!userQuery || typeof userQuery !== 'string') {
      return NextResponse.json(
        { error: 'userQuery is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await aiOrchestratorService.processQuery({
      roleType,
      userQuery,
      studentContext,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[/api/ai/query] Error processing query:', error.message || error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal AI service error',
        data: {
          type: 'general_answer',
          summary: 'Our AI engine is currently experiencing high load. Please try again shortly or explore our practice question bank.',
          sections: [
            {
              heading: 'Notice',
              content: 'AI services are operating with fallback mechanisms. You can continue practicing chapter MCQs and reviewing mistake notebooks.',
            },
          ],
          recommendedNextActions: [
            { label: 'Practice Chapter MCQs', action: 'start_practice' },
            { label: 'Check Eligibility', action: 'check_eligibility' },
          ],
        },
      },
      { status: 200 }
    );
  }
}
