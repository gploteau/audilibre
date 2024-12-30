import { TracksListBehaviourProvider } from '@/contexts/tracks-list';
import ItemsContentListLayoutPlayerPage from './items/Items';

const ContentListLayoutPlayerPage = (props) => {
  return (
    <TracksListBehaviourProvider>
      <ItemsContentListLayoutPlayerPage {...props} />
    </TracksListBehaviourProvider>
  );
};

export default ContentListLayoutPlayerPage;
