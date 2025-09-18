import Button from '@/components/common/Button';
import { BsFillPlayFill } from 'react-icons/bs';
import { BsFillPauseFill } from 'react-icons/bs';
import { useState } from 'react';

interface PlayButtonProps {
  className?: string;
  onClick?: (isPlaying: boolean) => void;
  disabled?: boolean;
  playing?: boolean;
}

export default function Play({ className, onClick, disabled, playing = false }: PlayButtonProps) {

  const handleClick = () => {
    onClick?.(!playing);
  };

  return (
    <Button iconOnly size="md" className={className} onClick={handleClick} disabled={disabled} color={disabled ? 'tertiary' : undefined}>
      {playing ? <BsFillPauseFill /> : <BsFillPlayFill />}
    </Button>
  );
}
