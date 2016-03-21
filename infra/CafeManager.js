
const CAFE_MAP = {
  'inCafe': {
    id: 633,
    name: 'inCafe (Mountain View)'
  },
  'Cafe Elevate': {
    id: 772,
    name: 'Cafe Elevate (Sunnyvale)'
  },
  'Brick & Mortar': {
    id: 840,
    name: 'Brick & Mortar (Sunnyvale)'
  },
  'Nourish': {
    id: '108980',
    name: 'Nourish (SF)'
  }
};

class CafeManager {
  static getCafeIdFromName(cafeName) {
    return CAFE_MAP[cafeName]['id'];
  }

  static getCafeList() {
    return Object.keys(CAFE_MAP);
  }
};

module.exports = CafeManager;
