import ViewOwn from '@/components/own/View';
import { useTracksListBehaviourContext } from '@/contexts/tracks-list';
import { TextInput, useTheme } from 'react-native-paper';

const SearchFooterContentListLayoutPlayerPage = (props) => {
  const { filterText, setFilterText } = useTracksListBehaviourContext();
  const theme = useTheme();

  return (
    <ViewOwn style={{ paddingTop: 14 }} column>
      <TextInput
        placeholderTextColor={theme.colors.outline}
        placeholder="Search"
        value={filterText}
        mode="flat"
        onChangeText={(text) => setFilterText(text)}
        right={
          filterText && (
            <TextInput.Icon icon="close-circle-outline" onPress={() => setFilterText('')} />
          )
        }
        underlineStyle={{
          backgroundColor: theme.colors.onBackground,
        }}
        contentStyle={{
          fontFamily: 'Montserrat_500Medium',
          width: '100%',
          display: 'block',
          outline: 'none',
          fontSize: 40,
          fontWeight: '200',
          backgroundColor: theme.colors.background,
        }}
      />
    </ViewOwn>
  );
};

export default SearchFooterContentListLayoutPlayerPage;
