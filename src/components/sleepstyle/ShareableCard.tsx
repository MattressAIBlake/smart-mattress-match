import { SleepPersonality } from "@/lib/sleepStyleTypes";
import squareTemplate from "@/assets/sleep-style-square.png";
import storyTemplate from "@/assets/sleep-style-story.png";

interface ShareableCardProps {
  personality: SleepPersonality;
  format: 'square' | 'story';
  quizUrl?: string;
}

export const ShareableCard = ({ personality, format, quizUrl = 'mattresswizard.com/sleepstyle' }: ShareableCardProps) => {
  const isSquare = format === 'square';
  const backgroundImage = isSquare ? squareTemplate : storyTemplate;
  
  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: isSquare ? '1080px' : '1920px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#ffffff',
        textAlign: 'center',
        padding: '80px',
      }}
    >
      {/* Personality Emoji */}
      <div
        style={{
          fontSize: isSquare ? '240px' : '280px',
          marginBottom: isSquare ? '40px' : '60px',
          lineHeight: 1,
        }}
      >
        {personality.emoji}
      </div>

      {/* Personality Name */}
      <h1
        style={{
          fontSize: isSquare ? '72px' : '84px',
          fontWeight: 'bold',
          marginBottom: isSquare ? '24px' : '32px',
          lineHeight: 1.1,
          textShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        {personality.name}
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: isSquare ? '36px' : '42px',
          fontStyle: 'italic',
          marginBottom: isSquare ? '60px' : '100px',
          opacity: 0.95,
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        "{personality.tagline}"
      </p>

      {/* Quiz URL */}
      <div
        style={{
          position: 'absolute',
          bottom: isSquare ? '60px' : '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: isSquare ? '32px' : '38px',
          fontWeight: '600',
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          letterSpacing: '0.5px',
        }}
      >
        {quizUrl}
      </div>
    </div>
  );
};