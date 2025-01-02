import ViewOwn from '@/components/own/View';
import { useTracksListBehaviourContext } from '@/contexts/tracks-list';
import { TextInput } from 'react-native-paper';

const SearchFooterContentListLayoutPlayerPage = (props) => {
  const { filterText, setFilterText } = useTracksListBehaviourContext();

  return (
    <ViewOwn style={{ paddingTop: 14 }} column>
      <TextInput
        placeholder="Search"
        value={filterText}
        mode="outlined"
        onChangeText={(text) => setFilterText(text)}
        right={<TextInput.Icon icon="close-circle-outline" onPress={() => setFilterText('')} />}
        contentStyle={{
          fontFamily: 'Montserrat_500Medium',
          width: '100%',
          display: 'block',
          outline: 'none',
          fontSize: 40,
          fontWeight: '200',
          border: 'none',
          borderBottom: '1px solid rgba(51,51,51,.7)',
        }}
      />
    </ViewOwn>
  );
};

export default SearchFooterContentListLayoutPlayerPage;
