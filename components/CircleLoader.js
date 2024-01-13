import {View, Text, Modal, Image} from 'react-native';
import React from 'react';

const CircleLoader = ({visible}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../assets/gifs/loader.gif')}
          style={{width: 60, height: 60}}
        />
      </View>
    </Modal>
  );
};

export default CircleLoader;
