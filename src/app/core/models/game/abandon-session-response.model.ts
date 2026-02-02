export interface AbandonSessionResponse {
    ok: boolean;
    status: 'abandoned';
    final_score: number;
    lives_remaining: number;
    total_questions_answered: number;
    ended_at: string;
    error?: string;
}
