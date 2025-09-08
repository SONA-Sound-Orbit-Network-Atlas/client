import Button from '@/components/common/Button';

export default function CreateNewButton() {
  const handleCreateNewGalaxy = () => {
    console.log('새 항성계 생성');
  };

  return (
    <Button
      color="secondary"
      className="w-full"
      onClick={handleCreateNewGalaxy}
    >
      + CREATE NEW GALAXY
    </Button>
  );
}
