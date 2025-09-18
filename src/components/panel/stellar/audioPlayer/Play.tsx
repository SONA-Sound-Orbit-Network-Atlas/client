import Button from '@/components/common/Button';
import { BsFillPlayFill } from 'react-icons/bs';
import { BsFillPauseFill } from 'react-icons/bs';
import { useState } from 'react';

interface PlayButtonProps {
  className?: string;
  onClick?: (isPlaying: boolean) => void;
}

export default function Play({ className, onClick }: PlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    onClick?.(next);
  };

  return (
    <Button iconOnly size="md" className={className} onClick={handleClick}>
      {isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill />}
    </Button>
  );
}
