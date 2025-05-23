import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LuCircleUserRound } from 'react-icons/lu';

const UserLogin = () => {
  return (
    <Button variant="ghost" asChild>
      <Link to="/">
        <LuCircleUserRound /> Logga in
      </Link>
    </Button>
  );
};
export default UserLogin;
