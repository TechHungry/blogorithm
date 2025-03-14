import getRedisClient from '@/clients/redis/client';
import crypto from 'crypto';

interface Token {
    id: string;
    value: string;
    createdAt: string;
}

const TOKENS_KEY = 'auth_tokens';

// Read tokens from Redis
async function getTokens(): Promise<Token[]> {
    try {
        const client = await getRedisClient();
        const data = await client.get(TOKENS_KEY);
        return data ? JSON.parse(data) as Token[] : [];
    } catch (error) {
        console.error('Error reading tokens from Redis:', error);
        return [];
    }
}

// Save tokens to Redis
async function saveTokens(tokens: Token[]): Promise<void> {
    try {
        const client = await getRedisClient();
        await client.set(TOKENS_KEY, JSON.stringify(tokens));
    } catch (error) {
        console.error('Error saving tokens to Redis:', error);
    }
}

// Generate a new token
export async function generateToken(): Promise<Token> {
    const tokens = await getTokens();

    const randomBytes = crypto.randomBytes(32);
    const tokenValue = randomBytes.toString('hex');

    const newToken = {
        id: crypto.randomUUID(),
        value: tokenValue,
        createdAt: new Date().toISOString()
    };

    tokens.push(newToken);
    await saveTokens(tokens);

    return newToken;
}

// Delete a token by ID
export async function deleteToken(id: string): Promise<boolean> {
    const tokens = await getTokens();
    const newTokens = tokens.filter(token => token.id !== id);

    if (tokens.length === newTokens.length) {
        return false;
    }

    await saveTokens(newTokens);
    return true;
}

// List all tokens
export async function listTokens(): Promise<Token[]> {
    return await getTokens();
}

// Validate a token
export async function validateToken(tokenValue: string): Promise<boolean> {
    const tokens = await getTokens();
    return tokens.some(token => token.value === tokenValue);
}