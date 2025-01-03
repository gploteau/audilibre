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
        mode="flat"
        onChangeText={(text) => setFilterText(text)}
        right={<TextInput.Icon icon="close-circle-outline" onPress={() => setFilterText('')} />}
        underlineStyle={{
          display: 'none',
        }}
        contentStyle={{
          fontFamily: 'Montserrat_500Medium',
          width: '100%',
          display: 'block',
          outline: 'none',
          fontSize: 40,
          fontWeight: '200',
        }}
      />
    </ViewOwn>
  );
};

export default SearchFooterContentListLayoutPlayerPage;
