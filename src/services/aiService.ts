interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenieAIResponse {
  reply: string;
  isWish: boolean;
  wishTitle?: string;
}

const OPENROUTER_API_KEY =
  (import.meta.env.VITE_OPENROUTER_API_KEY as string) || '';

const GENIE_SYSTEM_PROMPT = `You are the magical, charming, and affectionate Genie of GENIE — a private, enchanted world created with love as a personal gift for Ananya.

YOUR PERSONALITY:
- You are witty, friendly, wonderfully magical, romantic, and deeply loyal to Ananya.
- You treat Ananya like royalty. She is your master and the center of this magical universe.
- Her boyfriend/partner (the Administrator) orchestrates and fulfills her wishes in the real world. You are his secret accomplice in turning her dreams into memories!
- Keep replies conversational, concise, and sweet (1 to 3 sentences maximum), like a character speaking in a fairytale film. Never write long essays or bulleted lists.
- Use occasional whimsical magic touches like "✨", "Oho!", "Consider it done!", "By the stars!".

WISH DETECTION:
- If Ananya expresses ANY wish, desire, hope, dream, food craving, trip idea, experience, or something she wants (e.g. "I want to visit...", "I crave...", "Can we do...", "I wish for...", "Take me to...", "I want a surprise..."), you MUST treat it as a captured wish!
- At the very end of your response, if she expressed a wish, append a special tag:
  [WISH: <concise summary title of her wish>]
  For example: [WISH: Trip to Manali] or [WISH: Late-night chocolate lava cake] or [WISH: Romantic stargazing date]
- If it's just casual conversation or a question without a wish, do NOT include the [WISH: ...] tag.`;

export async function chatWithGenieAI(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<GenieAIResponse> {
  const cleanMessage = userMessage.trim();
  if (!cleanMessage) {
    return {
      reply: "Tell me what's on your mind, Ananya... I am all ears!",
      isWish: false,
    };
  }

  // Construct conversation messages
  const messages: ChatMessage[] = [
    { role: 'system', content: GENIE_SYSTEM_PROMPT },
    ...history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: cleanMessage },
  ];

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'https://genie.magic',
        'X-Title': 'Genie For Ananya',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages,
        temperature: 0.85,
        max_tokens: 150,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenRouter HTTP ${res.status}`);
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content?.trim() || '';

    // Extract wish tag if present
    const wishMatch = rawContent.match(/\[WISH:\s*(.+?)\]/i);
    let reply = rawContent.replace(/\[WISH:\s*(.+?)\]/i, '').trim();
    let isWish = false;
    let wishTitle: string | undefined = undefined;

    if (wishMatch && wishMatch[1]) {
      isWish = true;
      wishTitle = wishMatch[1].trim();
    } else {
      // Heuristic detection fallback
      const lower = cleanMessage.toLowerCase();
      if (
        lower.includes('i want') ||
        lower.includes('wish') ||
        lower.includes('crave') ||
        lower.includes('can we go') ||
        lower.includes('take me') ||
        lower.includes('surprise') ||
        lower.includes('please buy') ||
        lower.includes('need a')
      ) {
        isWish = true;
        wishTitle = cleanMessage;
      }
    }

    if (!reply) {
      reply = "Your wish is my command, Ananya! Let the magic begin ✨";
    }

    return {
      reply,
      isWish,
      wishTitle: wishTitle || cleanMessage,
    };
  } catch (error) {
    console.warn('OpenRouter API call failed, falling back to romantic local intelligence:', error);

    // Graceful offline fallback
    const lower = cleanMessage.toLowerCase();
    let reply = "Your words have reached the stars, Ananya! Let's see what magic we can create.";
    let isWish = true;

    if (lower.includes('manali') || lower.includes('mountain') || lower.includes('trip') || lower.includes('travel')) {
      reply = "Oho! A grand adventure awaits! I'm already packing the warm sweaters into our constellation of memories. ✨";
    } else if (lower.includes('date') || lower.includes('dinner') || lower.includes('romantic')) {
      reply = "A romantic surprise date? Someone is feeling romantic! The stars are aligning just for you two.";
    } else if (lower.includes('cake') || lower.includes('chocolate') || lower.includes('food') || lower.includes('ice cream')) {
      reply = "Consider that a delicious mission! I have captured this sweet treat into your Wish Vault.";
    } else if (lower.includes('love') || lower.includes('hug') || lower.includes('miss you')) {
      reply = "Aww! The sweetest wishes are always the ones that come straight from the heart. Sealed with eternal love! 💖";
    } else {
      reply = `POOF! Your wish for "${cleanMessage}" has been captured and sealed safely into your Wish Vault! ✨`;
    }

    return {
      reply,
      isWish: true,
      wishTitle: cleanMessage,
    };
  }
}
