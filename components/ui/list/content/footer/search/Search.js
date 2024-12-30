import ViewOwn from '@/components/own/View';
import { useTracksListBehaviourContext } from '@/contexts/tracks-list';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TextInput } from 'react-native-paper';

const SearchFooterContentListLayoutPlayerPage = (props) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const { filterText, setFilterText } = useTracksListBehaviourContext();

  return (
    <ViewOwn style={{ paddingTop: 14 }} column>
      <TextInput
        placeholder="Search"
        value={filterText}
        onChangeText={(text) => setFilterText(text)}
        activeUnderlineColor="#333"
        placeholderTextColor="#757575"
        right={
          <TextInput.Icon
            icon="close-circle-outline"
            onPress={() => setFilterText('')}
            color={textColor}
          />
        }
        contentStyle={{
          fontFamily: 'Montserrat_500Medium',
          paddingLeft: 0,
          width: '100%',
          display: 'block',
          outline: 'none',
          backgroundColor,
          fontSize: 40,
          fontWeight: '200',
          color: textColor,
          border: 'none',
          borderBottom: '1px solid rgba(51,51,51,.7)',
        }}
      />
    </ViewOwn>
  );
};

export default SearchFooterContentListLayoutPlayerPage;
