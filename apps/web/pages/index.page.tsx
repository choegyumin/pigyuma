import { Button } from '@pigyuma/ui';
import { useRecoilValue } from 'recoil';
import { myState } from '~/store/sample';
import styles from './index.css';

const Home = () => {
  const { author } = useRecoilValue(myState);

  return (
    <div>
      <h1 className={styles.heading}>{author}</h1>
      <input type="text" placeholder="Blah Blah" />
      <Button>Boop</Button>
    </div>
  );
};
Home.displayName = 'Home';

export default Home;
