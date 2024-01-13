import {Dimensions, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Sizes} from '../constants/styles';

const {width, height} = Dimensions.get('window');

export default function HomeBannerPlaceHolder() {
  return (
    <View style={{marginVertical: Sizes.fixPadding * 2}}>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item
          width={width * 0.9}
          height={60}
          borderRadius={Sizes.fixPadding}
          alignSelf="center"
          marginBottom={Sizes.fixPadding * 2}
        />
        <SkeletonPlaceholder.Item
          width={width * 0.9}
          height={120}
          borderRadius={Sizes.fixPadding}
          alignSelf="center"
          marginBottom={Sizes.fixPadding * 2}
        />
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          width={width * 0.9}
          alignSelf="center"
          justifyContent="space-between"
          marginBottom={Sizes.fixPadding * 2}>
          <SkeletonPlaceholder.Item
            width={width * 0.2}
            height={width * 0.2}
            borderRadius={1000}
          />
          <SkeletonPlaceholder.Item
            width={width * 0.2}
            height={width * 0.2}
            borderRadius={1000}
          />
          <SkeletonPlaceholder.Item
            width={width * 0.2}
            height={width * 0.2}
            borderRadius={1000}
          />
          <SkeletonPlaceholder.Item
            width={width * 0.2}
            height={width * 0.2}
            borderRadius={1000}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={width * 0.9}
          height={120}
          borderRadius={Sizes.fixPadding}
          alignSelf="center"
          marginBottom={Sizes.fixPadding * 2}
        />
        <SkeletonPlaceholder.Item
          width={width * 0.9}
          height={120}
          borderRadius={Sizes.fixPadding}
          alignSelf="center"
          marginBottom={Sizes.fixPadding * 2}
        />
      </SkeletonPlaceholder>
    </View>
  );
}
