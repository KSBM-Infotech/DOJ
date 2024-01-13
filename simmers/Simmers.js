import {Dimensions, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Sizes} from '../constants/styles';

const {width, height} = Dimensions.get('window');
export function CartSimmer() {
  return (
    <View style={{ marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,}}>
      <SkeletonPlaceholder borderRadius={4}>
        {/* <SkeletonPlaceholder.Item
          width={width * 0.9}
          height={60}
          borderRadius={Sizes.fixPadding}
          alignSelf="center"
          marginBottom={Sizes.fixPadding * 2}
        /> */}
        <SkeletonPlaceholder.Item
          width={width - Sizes.fixPadding * 4.0}
          height={140}
          borderRadius={Sizes.fixPadding}
          alignSelf="center"
        //   marginBottom={Sizes.fixPadding * 2}
        />
      </SkeletonPlaceholder>
    </View>
  );
}
