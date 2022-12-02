import { Button } from '@pigyuma/ui';
import styles from './index.css';

const Home = () => {
  return (
    <div>
      <h1 className={styles.heading}>Web</h1>
      <input type="text" placeholder="Blah Blah" />
      <Button>Boop</Button>
    </div>
  );
};
Home.displayName = 'Home';

export default Home;
