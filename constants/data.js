export const actions = [
  {
    title: 'Camera',
    type: 'camera-alt',
    options: {
      maxWidth: 300,
      maxHeight: 300,
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.2,
    },
  },
  {
    title: 'Select Photo From Gallery',
    type: 'photo-album',
    options: {
      maxWidth: 300,
      maxHeight: 300,
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.2,
    },
  },
];

export const restaurant_filters = [
  {
    id: 1,
    title: 'Sort',
    icon: 'arrow-drop-down',
    options: [
      {
        id: 1,
        title: 'Relevance',
        api_value: 'relevance'
      },
      {
        id: 2,
        title: 'Rating : High To Low',
        api_value: 'rating_high_to_low'
      },
      {
        id: 3,
        title: 'Delivery Time : Low To High',
        api_value: 'rating_high_to_low'
      },
      {
        id: 4,
        title: 'Delivery Time & Relevance',
        api_value: 'rating_high_to_low'
      },
      {
        id: 5,
        title: 'Cost : Low To High',
        api_value: 'cost_low_to_high'
      },
      {
        id: 6,
        title: 'Cost : High To Low',
        api_value: 'cost_high_to_low'
      },
    ],
  },
  {
    id: 2,
    title: 'Nearest',
    icon: '',
    options: null,
  },
  {
    id: 3,
    title: 'Great Offers',
    icon: '',
    options: null,
  },
  {
    id: 4,
    title: 'Rating 4.0+',
    icon: '',
    options: null,
  },
  {
    id: 5,
    title: 'Pure Veg',
    icon: '',
    options: null,
  },
  {
    id: 6,
    title: 'Cuisines',
    icon: 'arrow-drop-down',
    options: [
      {
        id: 1,
        title: 'North Indian',
      },
      {
        id: 2,
        title: 'South Indian',
      },
      {
        id: 3,
        title: 'Mughlai',
      },
      {
        id: 4,
        title: 'Chinese',
      },
      {
        id: 5,
        title: 'Italian',
      },
      {
        id: 6,
        title: 'Oriental',
      },
    ],
  },
];
